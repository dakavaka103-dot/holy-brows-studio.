import express from 'express';
import 'dotenv/config';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const allowed = (process.env.ALLOWED_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.includes(origin)) }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, telegramConfigured: Boolean(BOT_TOKEN && CHAT_ID) }));
app.post('/api/booking', async (req, res) => {
  if (!BOT_TOKEN || !CHAT_ID) return res.status(503).json({ ok: false, error: 'Telegram is not configured' });
  const { name, phone, service, date, time } = req.body || {};
  if ([name, phone, service, date, time].some(v => typeof v !== 'string' || !v.trim() || v.length > 300)) return res.status(400).json({ ok: false, error: 'Заполните все обязательные поля' });
  const safe = v => String(v).replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
  const message = ['✨ <b>Новая заявка — BROW STUDIO</b>', '', `👤 Имя: ${safe(name)}`, `📞 Телефон: ${safe(phone)}`, `Услуга: ${safe(service)}`, `📅 Дата: ${safe(date)}`, `🕒 Время: ${safe(time)}`].join('\n');
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' }) });
    const data = await r.json();
    if (!r.ok || !data.ok) return res.status(502).json({ ok: false, error: 'Telegram notification failed' });
    res.json({ ok: true });
  } catch { res.status(502).json({ ok: false, error: 'Notification service unavailable' }); }
});
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
