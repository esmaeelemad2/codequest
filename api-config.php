<?php
/**
 * CodeSkill AI Tutor - Configuration File Template
 *
 * This file is stored outside the public document root (/home/codeskill/api-config.php).
 * File permissions: chmod 640 /home/codeskill/api-config.php
 *
 * Primary Provider: Groq API (openai/gpt-oss-20b)
 * Active Fallback: Google Gemini (gemini-3.6-flash)
 */

// Primary Provider: Groq
$AI_PROVIDER = 'groq';
$AI_API_BASE_URL = 'https://api.groq.com/openai/v1';
$AI_API_KEY = ''; // Primary Groq API key: gsk_...
$AI_MODEL = 'openai/gpt-oss-20b';

// Fallback Provider 1: OpenRouter (optional)
$AI_FALLBACK_PROVIDER = 'openrouter';
$AI_FALLBACK_API_BASE_URL = 'https://openrouter.ai/api/v1';
$AI_FALLBACK_API_KEY = ''; // Optional OpenRouter API key
$AI_FALLBACK_MODEL = 'openrouter/free';

// Active Fallback 2: Google Gemini
$AI_GEMINI_API_KEY = ''; // Google Gemini API key
$AI_GEMINI_MODEL = 'gemini-3.6-flash';
