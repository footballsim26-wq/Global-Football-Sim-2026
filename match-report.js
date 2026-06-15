// /api/health.js — Status check endpoint
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: 'Global Football Simulator 2026',
    timestamp: new Date().toISOString(),
    env: { anthropicKey: !!process.env.ANTHROPIC_API_KEY }
  });
}
