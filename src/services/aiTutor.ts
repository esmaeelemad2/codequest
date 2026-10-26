export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiTutorResponse {
  content?: string;
  error?: string;
  setup_required?: boolean;
  message?: string;
}

const AI_ENDPOINT = '/api/chat.php';
const MAX_HISTORY_MESSAGES = 12; // Keep last 12 messages for context

export const sendMessageToAI = async (
  messages: ChatMessage[],
  language: string = 'general'
): Promise<AiTutorResponse> => {
  // Only send last MAX_HISTORY_MESSAGES to keep context size reasonable
  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: recentMessages, language }),
      signal: AbortSignal.timeout(35000),
    });

    const data: AiTutorResponse = await response.json();

    if (response.status === 503 && data.setup_required) {
      return { setup_required: true, message: data.message };
    }

    if (response.status === 429) {
      return { error: 'Rate limit reached. Please wait a moment before sending another message.' };
    }

    if (!response.ok || data.error) {
      return { error: data.error || 'An unexpected error occurred. Please try again.' };
    }

    return { content: data.content };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { error: 'The request timed out. The AI service may be busy — please try again.' };
    }
    return { error: 'Could not reach the AI service. Please check your connection and try again.' };
  }
};
