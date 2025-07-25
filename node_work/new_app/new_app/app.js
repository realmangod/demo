// app.js
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;


const apiKey = '4df4c74c9856144652f1427846273f90';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Weather API route
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ error: 'City not found or API error', details: data.message });
    }

    res.json({
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      country: data.sys.country
    });
  } catch (err) {
    console.error('Error fetching weather:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
