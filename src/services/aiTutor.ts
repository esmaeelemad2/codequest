export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiTutorResponse {
  content?: string;
  error?: string;
  setup_required?: boolean;
  message?: string;
  model?: string;
  fallback?: boolean;
  cached?: boolean;
}

const AI_ENDPOINT = '/api/chat.php';
// Keep only 6 most recent messages for optimal latency and token efficiency
const MAX_HISTORY_MESSAGES = 6;

/**
 * Stream responses token-by-token from the server via Server-Sent Events.
 */
export const streamMessageFromAI = async (
  messages: ChatMessage[],
  language: string = 'general',
  onChunk: (delta: string, accumulated: string) => void,
  signal?: AbortSignal
): Promise<AiTutorResponse> => {
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);
  let accumulated = '';

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ messages: recentMessages, language, stream: true }),
      signal: signal ?? AbortSignal.timeout(35000),
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned JSON instead of text/event-stream (e.g., error or setup_required)
    if (contentType.includes('application/json')) {
      const data: AiTutorResponse = await response.json();
      if (response.status === 503 && data.setup_required) {
        return { setup_required: true, message: data.message };
      }
      if (response.status === 429) {
        return { error: 'The AI tutor is currently busy. Please wait a moment before trying again.' };
      }
      if (!response.ok || data.error) {
        return { error: data.error || 'The AI tutor is temporarily unavailable. Please try again shortly.' };
      }
      if (data.content) {
        onChunk(data.content, data.content);
        return { content: data.content, model: data.model, fallback: data.fallback, cached: data.cached };
      }
    }

    if (!response.ok) {
      if (response.status === 503) {
        return { error: 'The AI tutor is temporarily busy. Your message is preserved; please click Retry to try again.' };
      }
      return { error: 'The AI tutor is temporarily unavailable. Please try again shortly.' };
    }

    if (!response.body) {
      return { error: 'Streaming is not supported by your browser.' };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') {
          continue;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            return { error: parsed.error };
          }
          if (parsed.content) {
            accumulated += parsed.content;
            onChunk(parsed.content, accumulated);
          }
        } catch {
          // Skip unparseable chunks
        }
      }
    }

    return { content: accumulated };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        if (accumulated.length > 0) {
          return { content: accumulated };
        }
        return { error: 'The request timed out. The AI service may be busy — please try again.' };
      }
    }
    return { error: 'Could not connect to the AI tutor service. Please check your network and try again.' };
  }
};

/**
 * Standard non-streaming fallback request
 */
export const sendMessageToAI = async (
  messages: ChatMessage[],
  language: string = 'general',
  signal?: AbortSignal
): Promise<AiTutorResponse> => {
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: recentMessages, language, stream: false }),
      signal: signal ?? AbortSignal.timeout(30000),
    });

    const data: AiTutorResponse = await response.json();

    if (response.status === 503 && data.setup_required) {
      return { setup_required: true, message: data.message };
    }

    if (response.status === 429) {
      return { error: 'The AI tutor is currently busy. Please wait a moment before trying again.' };
    }

    if (!response.ok || data.error) {
      return { error: data.error || 'The AI tutor is temporarily unavailable. Please try again shortly.' };
    }

    return { content: data.content, model: data.model, fallback: data.fallback, cached: data.cached };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { error: 'The request timed out. The AI service may be busy — please try again.' };
    }
    return { error: 'Could not reach the AI service. Please check your connection and try again.' };
  }
};
