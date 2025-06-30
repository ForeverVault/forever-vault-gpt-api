const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI with API key from .env or Render's environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route for GPT interaction
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Something went wrong with the AI response.' });
  }
});

// Serve the index.html frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Forever Vault backend running on port ${PORT}`));
