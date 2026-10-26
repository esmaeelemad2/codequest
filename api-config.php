<?php
/**
 * CodeQuest AI Tutor - Configuration File
 *
 * This file is intentionally stored outside of the public document root
 * (/home/codeskill/api-config.php) so that API keys and secrets can NEVER
 * be downloaded or exposed via the web server.
 *
 * Supported providers: OpenAI, OpenRouter, Azure OpenAI, Groq, Mistral, Ollama,
 * or any OpenAI-compatible /chat/completions endpoint.
 */

// Your private AI API key (e.g. 'sk-...' or your provider key)
$AI_API_KEY = '';

// The base URL for the OpenAI-compatible endpoint (without trailing slash)
$AI_API_BASE_URL = 'https://api.openai.com/v1';

// The model identifier to use (e.g. 'gpt-4o-mini', 'gpt-4o', etc.)
$AI_MODEL = 'gpt-4o-mini';
