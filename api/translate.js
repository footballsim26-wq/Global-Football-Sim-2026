// /api/match-report.js — Vercel Serverless Function
// Generates AI match report via Claude API
// API key stays server-side — never exposed to the browser

const FALLBACKS = [
  (t1, t2, score, pi) =>
    `${t1} and ${t2} produced an absolute classic, finishing ${score}${pi}. Both sides gave everything in a breathtaking display of football. This result will be debated for years to come.`,
  (t1, t2, score, pi) =>
    `What drama as ${t1} faced ${t2} — the scoreline ${score}${pi} tells only half the story. Moments of individual brilliance mixed with collective effort in a match that had everything. The fans witnessed something truly special.`,
  (t1, t2, score, pi) =>
    `A pulsating encounter between ${t1} and ${t2} ended ${score}${pi}. The tactical battle was fierce, with both managers throwing everything at the problem. When the final whistle blew, only the narrowest of margins separated these two sides.`,
];

// Simple in-memory rate limiter (resets on cold start)
const rateLimiter = new Map();
const RATE_LIMIT = 15; // requests per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimiter.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_WINDOW;
  }
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

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(ip)) {
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return res.status(200).json({ text: fallback('the teams', '', '', '') + ' (Rate limit reached — using fallback narrative.)' });
  }

  const { t1, t2, score, penalties } = req.body || {};

  if (!t1 || !t2) {
    return res.status(400).json({ error: 'Missing team names' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return res.status(200).json({ text: fallback(t1, t2, score || '?-?', penalties || '') });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // cheapest model — ~$0.001 per report
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `You are a dramatic football commentator. Write exactly 3 vivid, exciting sentences reporting this result: ${t1} ${score} ${t2}${penalties}. Pure narrative only — no labels, no headings.`
        }]
      }),
      signal: AbortSignal.timeout(10000) // 10-second timeout
    });

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (text) {
      return res.status(200).json({ text });
    }
    throw new Error('No content from API');

  } catch (error) {
    console.error('Match report error:', error.message);
    const fallback = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    return res.status(200).json({ text: fallback(t1, t2, score || '?-?', penalties || '') });
  }
}
