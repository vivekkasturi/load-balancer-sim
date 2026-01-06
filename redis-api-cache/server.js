import express from 'express';
import fetch from 'node-fetch';
// import './services/redisClient';
import { client } from "./services/redisClient.js"
const app = express();
const PORT = 5000;


// simulate backend API
const API_URL = "https://fakestoreapi.com/products";

app.get('/', async (req, res) => {

    const cacheKey = "1";
    // Simulate fetching data from backend API
    const cacheData = await client.get(cacheKey);
    console.log(`Cache data: ${cacheData}`);
    try {
      // Check Redis cache
      const cachedData = await client.get(cacheKey)
          if (cachedData) {
        console.log("⚡ Served from Redis cache");
        return res.json({
          source: "redis-cache",
          data: JSON.parse(cachedData),
        });
      }
  
      //  Fetch from network
      console.log("🌐 Fetching from API...");
      const response = await fetch(API_URL);
      const data = await response.json();
  
      // Save to Redis with TTL (60 seconds)
      await client.setEx(cacheKey, 60, JSON.stringify(data));

      res.json({
        source: "api",
        data,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
}); 


app.listen(PORT, () => {
    console.log(`Redis API Cache Server running on port ${PORT}`);
})