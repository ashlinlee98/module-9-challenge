import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
//import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;
  // TODO: GET weather data from city name
  const apiKey = 'f560328cd382b563718f8b0086ef3529';  // Replace with your actual OpenWeather API key
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Failed to fetch weather data' });
  }

  // TODO: save city to search history
  try {
    await HistoryService.addCity(city);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Failed to add city to history' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Failed to fetch cities from history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await HistoryService.removeCity(id);
    res.status(204).send(); // No content to return on successful delete
  } catch (error) {
    console.error('Error removing city from history:', error);
    res.status(500).send({ error: 'Failed to remove city from history' });
  }
});

export default router;
