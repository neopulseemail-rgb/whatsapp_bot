const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;
const VERIFY = process.env.VERIFY_TOKEN;

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY)
    return res.send(req.query['hub.challenge']);
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  const msg = req.body?.entry?.[0]
    ?.changes?.[0]?.value?.messages?.[0];
  if (msg?.type === 'text') {
    const from = msg.from;
    const text = msg.text.body.toLowerCase();
    let reply = 'Hello! How can I help you?';
    if (text.includes('hi') || text.includes('hello'))
      reply = 'Hi there! How can I help you today?';
    if (text.includes('price'))
      reply = 'Please visit our website for prices.';
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`,
      { messaging_product:'whatsapp', to:from,
        type:'text', text:{body:reply} },
      { headers:{Authorization:`Bearer ${TOKEN}`} }
    );
  }
  res.sendStatus(200);
});

app.get('/health', (_, res) => res.send('OK'));
app.listen(3000, () => console.log('Bot running!'));
📄 render.yaml
