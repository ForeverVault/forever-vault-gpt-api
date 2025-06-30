const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ MAIN GPT INTERACTION
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-3.5-turbo' if needed
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Something went wrong with the AI response.' });
  }
});

// ✅ TESTING ENDPOINT: Which models does this API key support?
app.get('/api/models', async (req, res) => {
  try {
    const models = await openai.models.list();
    const modelNames = models.data.map(m => m.id);
    res.json({ models: modelNames });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch model list.' });
  }
});

// ✅ SERVE FRONTEND
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Forever Vault backend running on port ${PORT}`));
