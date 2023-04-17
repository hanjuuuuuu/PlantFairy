import express from 'express';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mysql from 'mysql';
import * as dotenv from 'dotenv';
import { db } from './db.js';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', authRoutes);

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${message} 식물 이름 3가지 추천해주고 식물 특성도 간단히 설명해줘`,
      max_tokens: 1000,
      temperature: 0.8,
    });

    console.log(response.data);

    if (response.data && response.data.choices) {
      const plantRecommendations = response.data.choices[0].text
        .trim()
        .split(/\d+\./)
        .filter((recommendation) => recommendation) // remove empty strings
        .map((recommendation) => {
          const [name, context] = (recommendation || '').trim().split(/:\s+|-/);
          return { name, context };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert = 'INSERT INTO plant(name, context) VALUES (?, ?)';
      plantRecommendations.forEach((recommendation) => {
        db.query(sqlInsert, [recommendation.name, recommendation.context || ''], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      });

      res.json({ message: plantRecommendations });
    } else {
      res.json({ message: 'Error fetching plant recommendations' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Connected...');
});
