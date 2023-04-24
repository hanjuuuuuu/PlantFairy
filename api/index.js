import express from 'express';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mysql from 'mysql';
import * as dotenv from 'dotenv';
import download from 'image-downloader';
import path from 'path';
import fs from 'fs';
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
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

let plantRecommendations;

app.post('/recommend', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `It recommends and explains the 3 plants in the ${message}, and the answer format is 1.2.3. Number it like this, use : to distinguish between the plant name and description, translate it into Korean, and print only Korean.`,
      max_tokens: 1000,
      temperature: 0.8,
    });

    console.log(response.data);

    if (response.data && response.data.choices) {
      plantRecommendations = response.data.choices[0].text
        .trim()
        .split(/\d+\./)
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          const [name, context] = (recommendation || '').trim().split(/:\s+/);
          return { name, context };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert = 'INSERT INTO plant(plant_name, context) VALUES (?, ?)';
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

// 여기는 돈나감!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.post('/', async (req, res) => {
  //const { message } = req.body;
  //console.log(message);
  const images = [];

  if (!plantRecommendations || !plantRecommendations.length) {
    console.log('plantRecommendations is not defined or is empty');
    return res.status(400).json({ message: 'plantRecommendations is not defined or is empty' });
  }

  for (let i = 0; i < plantRecommendations.length; i++) {
    const response = await openai.createImage({
      prompt: `${plantRecommendations[i].name}`,
      n: 1,
      size: '256x256',
    });
    const image_url = response.data.data[0].url;
    images.push(image_url);
  }

  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const options = {
        url: images[i],
        dest: '../../sources',
      };

      download
        .image(options)
        .then(({ filename }) => {
          console.log('Saved to', filename); // saved to /path/to/dest/image.jpg

          const imagePath = path.join('sources/', path.basename(filename)).replace(/\\/g, '/');
          // Save the path to the database
          db.query(`UPDATE plant SET img ='${imagePath}' WHERE plant_name='${plantRecommendations[i].name}'`, (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).send('Error saving image path to the database');
            }
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error saving image to local file system');
        });
    }

    res.json({
      message: 'Image creation complete',
      images: images,
    });
  } else {
    res.status(500).send('Error creating images');
  }
});

// 이미지 받아오는 기능
/*
app.get('/images/:engName', (req, res) => {
  const engName = req.params.engName.replace(/\n/g, '');
  console.log(`engName = ${engName}`);

  db.query(`SELECT img FROM plant WHERE engName = '${engName}'`, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Plant not found');
    }

    const imgPath = result[0].img;
    console.log(`imgPath = ${imgPath}`);
    const imgExists = fs.existsSync(imgPath);
    if (!imgExists) {
      return res.status(404).send('Image not found');
    }
    const imgFile = fs.readFileSync(imgPath);
    res.writeHead(200, { 'Content-Type': 'image/png' }); 
    res.end(Buffer.from(imgFile).toString('base64'));
  });
});
*/

app.listen(8800, () => {
  console.log('Connected...');
});
