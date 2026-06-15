// /api/translate.js — Vercel Serverless Function
// Translates fan reactions using Claude API

const rateLimiter = new Map();
const RATE_LIMIT = 25;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimiter.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + RATE_WINDOW; }
  record.count++;
  rateLimiter.set(ip, record);
  return record.count <= RATE_LIMIT;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (!checkRateLimit(ip)) return res.status(200).json({ text: '(Translation limit reached for this hour)' });

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(200).json({ text: '(Translation requires API key)' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: `Translate to English. Return ONLY the translation, nothing else:\n"${text}"` }]
      }),
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json();
    return res.status(200).json({ text: data.content?.[0]?.text || '(Translation unavailable)' });
  } catch (error) {
    return res.status(200).json({ text: '(Translation service temporarily unavailable)' });
  }
}
