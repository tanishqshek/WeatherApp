const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get('/api/weather', async (req, res) => {
  const { cityName } = req.query;
  const apiKey = 'c8cb8273e6e7ac70c2fcb2f9cb6a4068';
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

  try {
    const fetch = await import('node-fetch');
    const response = await fetch.default(apiUrl);

    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();

    const weatherData = {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
    };
    res.set('Access-Control-Allow-Origin', '*');
    res.json(weatherData);
  } catch (error) {
    res.status(404).json({ error: "Enter a valid city!" });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
