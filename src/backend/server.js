const secretName = 'weatherApp';
const { getSecretValue } = require('./config/aws');

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongoose');
const { Schema } = mongodb;

const app = express();
const PORT = process.env.PORT || 8888;

getSecretValue(secretName)
  .then(secret => {
    // Now you can access the secret object
    console.log('Secret:', secret);
    // Example: const apiKey = secret.API_KEY;
    // Continue with your application logic here
  })
  .catch(error => {
    console.error('Error fetching secret:', error);
    // Handle error appropriately
  });

const formatWeatherData = (weatherData) => {
  return {
    city: weatherData.name,
    temperature: weatherData.main.temp,
    description: weatherData.weather[0].description,
  };
};

const weatherSchema = new Schema({
  city: { type: String, unique: true },
  data: { type: Object },
  createdAt: { type: Date, default: Date.now, expires: 60 * 30 }
});

const Weather = mongodb.model('Weather', weatherSchema);

app.use(bodyParser.json());

app.get('/api/weather', async (req, res) => {

  // Fetching the secrets and setting variables
  const secrets = await getSecretValue(secretName);
  const api_key = secrets.API_KEY;
  const username = secrets.MONGODB_USERNAME;
  const password = secrets.MONGODB_PASSWORD;

  const uri = `mongodb+srv://${username}:${password}@weathercluster.uacqtze.mongodb.net/?retryWrites=true&w=majority&appName=weatherCluster`;

  mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongodb.connection;

  const cityName = req.query.cityName;
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`;

  try {

    const cachedWeather = await Weather.findOne({ city: cityName });
    if(cachedWeather) {
      console.log('Weather data found in cache' + JSON.stringify(cachedWeather.data.name));

      const weatherData = formatWeatherData(cachedWeather.data);

      console.log("weatherData " + JSON.stringify(weatherData));
      res.set('Access-Control-Allow-Origin', '*');
      return res.json(weatherData);
    } else {

    const fetch = await import('node-fetch');
    const response = await fetch.default(apiUrl);
    const data = await response.json();

    await Weather.create({ city: cityName, data: data });

    if (!response.ok) {
      throw new Error('City not found');
    }
    

    const weatherData = formatWeatherData(data);
    res.set('Access-Control-Allow-Origin', '*');
    res.json(weatherData);
  }
  } catch (error) {
    res.status(404).json({ error: "Enter a valid city!" });
  }
  
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
