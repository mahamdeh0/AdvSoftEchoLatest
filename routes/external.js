
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const apiKey = process.env.ENVIRONMENTAL_NEWS_API_KEY;

router.get('/weather', async (req, res) => { // http://localhost:5000/api/external/weather?lat=40.7128&lon=-74.0060 example call 
  const { lat, lon } = req.query; 
  if (!lat || !lon) {
    return res.status(400).send('Latitude and longitude are required');
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Failed to fetch weather data');
  }
});

module.exports = router;
