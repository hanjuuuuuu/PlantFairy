import express from 'express';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db } from './db.js';
import download from 'image-downloader';
import path from 'path';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

import bodyParser from 'body-parser';


dotenv.config();
const app = express();



app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/api/auth', authRoutes);

app.use(bodyParser.json());


const configuration = new Configuration({
  apiKey: process.env.API_KEY,
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

      // MySQL 데이터베이스에 식물 데이터 삽입
      const sqlInsert = 'INSERT IGNORE INTO plant(plant_name, eng_name, plant_charateristic) VALUES (?, ?, ?)';
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

// 식물 투두리스트 생성
let todoRecommendations;
app.post('/rectodo', async (req, res) => {
  const plant =  req.body;
  console.log('recplantname',plant.plantname)
  console.log('recuserplantnum', plant.userplantnum)
  console.log('recusernum',plant.usernum)
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Please make a to-do list in Korean for 31 days with one thing to do to grow ${plant.plantname}, and the answer format is numbered as 1.2.3 `,
      max_tokens: 4000,
      temperature: 0.2,
    });

    console.log('_____________________________',response.data);

    if (response.data && response.data.choices) {
      todoRecommendations = response.data.choices[0].text
        .trim()
        .split("\n")
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          const [day, context] = (recommendation || '').trim().split(".");
          console.log('day', day, 'context', context);
          return { day: day, context: context };
        });

      // MySQL 데이터베이스에 식물 투두리스트 데이터 삽입
      const sqlInsert = 'INSERT INTO todo(user_num, user_plant_num, day, task, complete) VALUES (?, ?, ?, ?, ?)';
      todoRecommendations.forEach((recommendation) => {
        db.query(sqlInsert, [plant.usernum, plant.userplantnum, recommendation.day, recommendation.context, 'false'], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      });
      res.json({ message: todoRecommendations });
    } else {
      res.json({ message: 'Error todo recommendations' });
    }
  } catch (error) {
    console.log(error.response);
  }
})

//todo 페이지에 출력할 식물 투두리스트 전달
app.post('/planttodo', async (req, res) => {
  let plantname = req.body.plantname;
  let userplantnum = 93;
  let usernum = req.body.usernum;
  let tododay = req.body.day;
  console.log('todo plantname', plantname, 'todo userplantnum', userplantnum, 'todo day', tododay);

  const sqlplanttodo = `SELECT todo_num AS "key", task, complete, day FROM todo WHERE user_plant_num = '${userplantnum}'`;
  db.query(sqlplanttodo, (err, data) => {
    if(!err){
      console.log('planttodo', data)
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
})

// 메인 페이지에 출력할 메인 식물 정보 전달
app.post('/plantpicture', async (req, res) => {   
  let plantpicture = req.body.usernum;
  console.log('picture',plantpicture);

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name, plant_characteristic, plant_level, plant_picture FROM user_plant WHERE plant_main = 0 AND user_num = '${plantpicture}'`; 
  db.query(sqluserplant, plantpicture, (err,  data)=> {
    if(!err){
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
})


// 메인 페이지에서 메인으로 지정할 식물 고를 수 있게 사용자의 등록된 전체 식물 이름 전달 
app.post('/plantall', async (req, res) => {   
  let usernum = req.body.usernum;

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name FROM user_plant WHERE user_num = ${usernum}`; 
  db.query(sqluserplant, (err,  data)=> {
    if(!err){
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
})

//메인 페이지에 출력할 슬롯 별 식물 정보 전달
app.post('/plantslot', async (req, res) => {  
  let slotnum = req.body.slotnum; 
  let usernum = req.body.usernum;
  console.log('slotnum',slotnum, 'usernum', usernum);

  const sqluserplant = `SELECT user_plant_num AS "key",plant_name FROM user_plant WHERE user_num = '${usernum}' AND plant_main = '${slotnum}'`; 
  db.query(sqluserplant, (err,  data)=> {
    if(!err){
      console.log('plantslot', data)
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
})

app.post('/plantenroll', async(req, res) => {
  let usernum = req.body.usernum;
  let plantname = req.body.plantname;
  let plantmain = req.body.plantmain;
  let plantpicture = req.body.plantpicture;
  let plantcharacteristic = req.body.plantcharacteristic;
  console.log('enroll',plantname);
  
  const sqlplantenroll = 'INSERT INTO user_plant (user_num, plant_name, plant_main, plant_picture, plant_characteristic) values(?, ?, ?, ?, ?)';
  db.query(sqlplantenroll, [usernum, plantname, plantmain, plantpicture, plantcharacteristic], (err,  data)=> {
    if(!err){
      res.send(data);
    }
    else {
      console.log(err);
    }
  })
})

//성격 별 식물 추천
let plantGames
app.post('/plantgame', async(req, res) => {
  const { message } = req.body;
  console.log(message);
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${message} Please express your disposition in 3 lines in Korean and recommend a suitable plant along with the reason. (without the word ${message})`,
      max_tokens: 1000,
      temperature: 0.8,
    });

    console.log(response.data);

    if (response.data && response.data.choices) {
      plantGames = response.data.choices[0].text
        .trim()
        .split(/\d+\./)
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          console.log('context', recommendation);
          return { context: recommendation };
        });
        res.json({ message: plantGames });
    } else {
      res.json({ message: 'Error plantgame' });
    }
  } catch (error) {
    console.log(error.response);
  }
})

// 여기는 돈나감!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// app.post('/', async (req, res) => {
//   //const { message } = req.body;
//   //console.log(message);
//   const images = [];

//   if (!plantRecommendations || !plantRecommendations.length) {
//     console.log('plantRecommendations is not defined or is empty');
//     return res.status(400).json({ message: 'plantRecommendations is not defined or is empty' });
//   }

//   for (let i = 0; i < plantRecommendations.length; i++) {
//     const response = await openai.createImage({
//       prompt: `${plantRecommendations[i].name}`,
//       n: 1,
//       size: '256x256',
//     });
//     const image_url = response.data.data[0].url;
//     images.push(image_url);
//   }

//   if (images.length > 0) {
//     for (let i = 0; i < images.length; i++) {
//       const options = {
//         url: images[i],
//         dest: '../../sources',
//       };

//       download
//         .image(options)
//         .then(({ filename }) => {
//           console.log('Saved to', filename); // saved to /path/to/dest/image.jpg

//           const imagePath = path.join('sources/', path.basename(filename)).replace(/\\/g, '/');
//           // Save the path to the database
//           db.query(`UPDATE plant SET img ='${imagePath}' WHERE plant_name='${plantRecommendations[i].name}'`, (error, results) => {
//             if (error) {
//               console.log(error);
//               res.status(500).send('Error saving image path to the database');
//             }
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           res.status(500).send('Error saving image to local file system');
//         });
//     }

//     res.json({
//       message: 'Image creation complete',
//       images: images,
//     });
//   } else {
//     res.status(500).send('Error creating images');
//   }
// });

// // 이미지 받아오는 기능

// app.get('/images/:engName', (req, res) => {
//   const engName = req.params.engName.replace(/\n/g, '');
//   console.log(`engName = ${engName}`);
//   db.query(`SELECT plant_picture FROM plant WHERE eng_name = '${engName}'`, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('Server Error');
//     }
//     if (result.length === 0) {
//       return res.status(404).send('Plant not found');
//     }
//     const imgPath = result[0].img;
//     console.log(`imgPath = ${imgPath}`);
//     const imgExists = fs.existsSync(imgPath);
//     if (!imgExists) {
//       return res.status(404).send('Image not found');
//     }
//     const imgFile = fs.readFileSync(imgPath);
//     res.writeHead(200, { 'Content-Type': 'image/png' }); 
//     res.end(Buffer.from(imgFile).toString('base64'));
//   });
// });


app.listen(8800, () => {
  console.log('Connected...');
});
