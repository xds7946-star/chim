try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional; set env vars manually if not installed
}
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

app.use(express.static('.'));
app.use(express.json());

app.get('/contacts', (req, res) => {
  res.sendFile('contacts.html', { root: __dirname });
});

app.post('/api/telegram', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing TG_BOT_TOKEN or TG_CHAT_ID');
      return res.status(500).json({ ok: false, error: 'Server not configured' });
    }

    const { name, phone, message } = req.body || {};
    if (!name || !phone || !message) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const text = [
      'Нове повідомлення з сайту «Баланс»',
      `Ім’я: ${name}`,
      `Телефон: ${phone}`,
      `Повідомлення: ${message}`
    ].join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    const data = await tgRes.json();
    if (!data.ok) {
      console.error('Telegram error:', data);
      return res.status(500).json({ ok: false, error: 'Telegram error', details: data.description || 'unknown' });
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
