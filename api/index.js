import express from 'express';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import commentsRoutes from './routes/comments.js';
import likesRoutes from './routes/likes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import dotenv from 'dotenv';
import download from 'image-downloader';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { db } from './db.js';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(cookieParser());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);

const configuration = new Configuration({
  apiKey: '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', //process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

let plantRecommendations;

app.post('/recommend', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `The three plants in ${message} are recommended and explained, and the answer format is numbered as 1.2.3 and translated into Korean and Korean plant names and English plant names are separated by -, and English plant names and Korean plant descriptions are separated by :`,
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
          const [korName, englishName] = name.trim().split(' - ');
          return { korName: korName, englishName: englishName, context };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert = 'INSERT IGNORE INTO plant(plant_name, eng_Name, context) VALUES (?, ?, ?)';
      plantRecommendations.forEach((recommendation) => {
        db.query(sqlInsert, [recommendation.korName, recommendation.englishName, recommendation.context || ''], (err, result) => {
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

// 메인 페이지에 출력할 메인 식물 정보 전달
app.post('/plantpicture', async (req, res) => {
  let plantpicture = req.body.usernum;
  console.log('picture------', plantpicture);

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name, plant_characteristic, plant_level, plant_picture FROM user_plant WHERE plant_main = 0 AND user_num = '${plantpicture}'`;
  db.query(sqluserplant, plantpicture, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

// 메인 페이지에서 메인으로 지정할 식물 고를 수 있게 사용자의 등록된 전체 식물 이름 전달
app.post('/plantall', async (req, res) => {
  let usernum = req.body.usernum;

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name FROM user_plant WHERE user_num = ${usernum}`;
  db.query(sqluserplant, (err, data) => {
    if (!err) {
      console.log('data!!!!!!!!!', data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

//메인 페이지에 출력할 슬롯 별 식물 정보 전달
app.post('/plantslot', async (req, res) => {
  let slotnum = req.body.slotnum;
  let usernum = req.body.usernum;
  //console.log('slotnum',slotnum);

  const sqluserplant = 'SELECT user_plant_num AS "key",plant_name, plant_picture FROM user_plant WHERE user_num = ? AND plant_main = 1';
  db.query(sqluserplant, usernum, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.post('/plantenroll', async (req, res) => {
  let usernum = req.body.usernum;
  let plantname = req.body.plantname;
  let plantmain = req.body.plantmain;
  let plantpicture = req.body.plantpicture;
  let plantcharacteristic = req.body.plantcharacteristic;
  let plantlevel = req.body.plantlevel;
  console.log('enroll', plantname);

  const sqlplantenroll = 'INSERT INTO user_plant (user_num, plant_name, plant_main, plant_characteristic, plant_level) values(?, ?, ?, ?, ?)';
  db.query(sqlplantenroll, [usernum, plantname, plantmain, plantcharacteristic, plantlevel], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
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
      prompt: `${plantRecommendations[i].englishName}`,
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
          db.query(`UPDATE plant SET img ='${imagePath}' WHERE eng_Name='${plantRecommendations[i].englishName}'`, (error, results) => {
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
app.get('/imagespath/:plantName', (req, res) => {
  const plant_name = req.params.plantName.replace(/\n/g, '');

  db.query(`SELECT img FROM plant WHERE plant_name = '${plant_name}'`, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Plant not found');
    }

    const imgPath = result[0].img;
    res.send(imgPath);
  });
});

app.get('/images/:plantName', (req, res) => {
  const plant_name = req.params.plantName.replace(/\n/g, '');
  console.log('----', plant_name);

  // plant_name 대신 영어이름으로 바꾸기
  db.query(`SELECT img FROM plant WHERE plant_name = '${plant_name}'`, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }

    if (result.length === 0) {
      return res.status(404).send('Plant not found');
    }

    const imgPath = result[0].img;
    const imgExists = fs.existsSync(imgPath);
    if (!imgExists) {
      return res.status(404).send('Image not found');
    }
    const imgFile = fs.readFileSync(imgPath);
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(Buffer.from(imgFile).toString('base64'));
  });
});

app.listen(8800, () => {
  console.log('Connected...');
});
