<?php
/**
 * CodeSkill AI Tutor - Configuration File
 *
 * This file is intentionally stored outside of the public document root
 * (/home/codeskill/api-config.php) so that API keys and secrets can NEVER
 * be downloaded or exposed via the web server.
 *
 * File permissions should be restrictive: chmod 640 /home/codeskill/api-config.php
 *
 * Supported providers:
 * - 'gemini': Google Gemini API (recommended: 'gemini-3.5-flash')
 * - 'openai': OpenAI or any OpenAI-compatible /chat/completions endpoint
 */

// AI provider: 'gemini' or 'openai'
$AI_PROVIDER = 'gemini';

// Your private AI API key
$AI_API_KEY = '';

// The model identifier to use
// For Gemini: 'gemini-3.5-flash'
// For OpenAI: 'gpt-4o-mini', 'gpt-4o', etc.
$AI_MODEL = 'gemini-3.5-flash';

// (Optional) OpenAI-compatible base URL if $AI_PROVIDER = 'openai'
$AI_API_BASE_URL = 'https://api.openai.com/v1';
