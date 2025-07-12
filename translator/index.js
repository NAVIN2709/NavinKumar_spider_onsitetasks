const express = require('express');
const axios = require('axios');
const qs = require('qs'); 

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/translate', async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({ error: "Missing text, source, or target" });
  }

  try {
    const response = await axios.post(
      'https://apertium.org/apy/translate',
      qs.stringify({
        q: text,
        langpair: `${source}|${target}`,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Apertium Response:', response.data);

    const translatedText = response.data.responseData.translatedText;
    res.json({ translatedText });
  } catch (err) {
    console.error('Translation failed:', err.response?.data || err.message);
    res.status(500).json({ error: "Translation failed. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
