import express from "express";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
//import usersRoutes from './routes/users.js';
import commentsRoutes from "./routes/comments.js";
import likesRoutes from "./routes/likes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import dotenv from "dotenv";
import download from "image-downloader";
import path from "path";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";
import { db } from "./db.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// const configuration = new Configuration({
//   organization: 'org-cZFLDQG7d7vOU4ui4WLdE5FF',
//   apiKey: process.env.API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
//app.use('/api/users', usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);

let plantRecommendations;

app.post("/recommend", async (req, res) => {
  const { message } = req.body;
  console.log(message);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
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
          const [name, plant_characteristic] = (recommendation || "")
            .trim()
            .split(/:\s+/);
          const [korName, englishName] = name.trim().split(" - ");
          return {
            korName: korName,
            englishName: englishName,
            plant_characteristic,
          };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert =
        "INSERT IGNORE INTO plant(plant_name, eng_name, plant_characteristic) VALUES (?, ?, ?)";
      plantRecommendations.forEach((recommendation) => {
        db.query(
          sqlInsert,
          [
            recommendation.korName,
            recommendation.englishName,
            recommendation.plant_characteristic || "",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      res.json({ message: plantRecommendations });
    } else {
      res.json({ message: "Error fetching plant recommendations" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

let todoRecommendations;
let date = new Date();
let year = date.getFullYear();
let month = ("0" + (1 + date.getMonth())).slice(-2);
app.post("/rectodo", async (req, res) => {
  //식물 투두리스트 생성
  const plant = req.body;
  console.log(plant.plantname, plant.usernum);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Please make a detailed to-do list in Korean for 31 days of ${plant.engtodaymonth} with one thing to do to grow ${plant.plantname} plant, the answer format is numbered as 01.02.03`,
      max_tokens: 4000,
      temperature: 0.2,
    });

    console.log("_____________________________", response.data);

    if (response.data && response.data.choices) {
      todoRecommendations = response.data.choices[0].text
        .trim()
        .split("\n")
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          const [day, context] = (recommendation || "").trim().split(".");
          console.log("day", year + month + day, "context", context);
          return { day: year + month + day, context: context };
        });

      // MySQL 데이터베이스에 식물 투두리스트 데이터 삽입
      const sqlInsert =
        "INSERT INTO todo(user_num, user_plant_num, day, task, complete) VALUES (?, ?, ?, ?, ?)";
      todoRecommendations.forEach((recommendation) => {
        db.query(
          sqlInsert,
          [
            plant.usernum,
            plant.userplantnum,
            recommendation.day,
            recommendation.context,
            "",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });
      res.json({ message: todoRecommendations });
    } else {
      res.json({ message: "Error todo recommendations" });
    }
  } catch (error) {
    console.log(error);
  }
});

//todo 페이지에 출력할 식물 투두리스트 전달
app.post("/planttodo", async (req, res) => {
  let usernum = req.body.usernum;
  let plantname = req.body.plantname;
  let userplantnum = req.body.userplantnum; //req.body.userplantnum
  let tododay = req.body.day; //req.body.day
  console.log(
    "todo usernum",
    usernum,
    "todo plantname",
    plantname,
    "todo userplantnum",
    userplantnum,
    "todo day",
    tododay
  );

  const sqlplanttodo = `SELECT todo_num AS "key", task, complete, day FROM todo WHERE user_plant_num = '${userplantnum}' and day = '${tododay}'`;
  db.query(sqlplanttodo, (err, data) => {
    if (!err) {
      console.log("planttodo", data);
      const responseData = {
        plantname: plantname,
        userplantnum: userplantnum,
        tododay: tododay,
        tasks: data,
      };
      console.log("planttodotodotodo", responseData);
      res.send(responseData);
    } else {
      console.log(err);

      // 에러 발생 시 응답
      res.status(500).send("Internal Server Error");
    }
  });
});

//todo list 체크하면 체크 상태 변경
app.post("/updatetaskcomplete", async (req, res) => {
  let todonum = req.body.todonum;
  let complete = req.body.complete;
  console.log("updatetaskcomplete", todonum, complete);

  const sqltodocomplete = `UPDATE todo SET complete = '${complete}' WHERE todo_num = '${todonum}'`;

  db.query(sqltodocomplete, (err, data) => {
    if (!err) {
      console.log("update todocomplete", data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

//todo list 체크하면 user 포인트 올리기, 테스트하면 10포인트 차감하기
app.post("/updateuserpoints", async (req, res) => {
  let usernum = req.body.usernum;
  let userpoints = req.body.userpoints;
  console.log("points", usernum, userpoints);

  const sqluserpoint = `UPDATE user SET user_point = '${userpoints}' WHERE user_num = '${usernum}'`;
  db.query(sqluserpoint, (err, data) => {
    if (!err) {
      console.log("update points", data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

//사용자 포인트, 레벨 전달
app.post("/userpointslevel", async (req, res) => {
  console.log("userpointslevel");
  let usernum = req.body.usernum;
  const sqluserpoint = `SELECT user_point, user_level FROM user WHERE user_num = '${usernum}'`;
  db.query(sqluserpoint, (err, data) => {
    if (!err) {
      console.log("userpoint", data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.post("/inserttext", async (req, res) => {
  const { message } = req.body;
  const userNum = req.body.usernum;

  // insert 문으로 변경
  const sqlInsert =
    "INSERT INTO user_review(user_num, user_pick) VALUES (?, ?)";
  db.query(sqlInsert, [userNum, message], (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

// 메인 페이지에 출력할 메인 식물 정보 전달
app.post("/plantpicture", async (req, res) => {
  let plantpicture = req.body.usernum;
  console.log("usernum------", plantpicture);

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name, plant_characteristic, plant_picture FROM user_plant WHERE user_num = '${plantpicture}'`;
  db.query(sqluserplant, plantpicture, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.post("/getbeforplant", async (req, res) => {
  let plantpicture = req.body.usernum;
  //console.log('usernum------', plantpicture);

  const sqluserplant = `SELECT plant_name FROM user_plant WHERE user_num = '${plantpicture}' ORDER BY user_plant_num DESC LIMIT 1`;
  db.query(sqluserplant, plantpicture, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

// 메인 페이지에서 메인으로 지정할 식물 고를 수 있게 사용자의 등록된 전체 식물 이름 전달
app.post("/plantall", async (req, res) => {
  let usernum = req.body.usernum;

  const sqluserplant = `SELECT user_plant_num AS "key", plant_name FROM user_plant WHERE user_num = ${usernum}`;
  db.query(sqluserplant, (err, data) => {
    if (!err) {
      console.log("data!!!!!!!!!", data);
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

//메인 페이지에 출력할 슬롯 별 식물 정보 전달
app.post("/plantslot", async (req, res) => {
  let slotnum = req.body.slotnum;
  let usernum = req.body.usernum;
  //console.log('slotnum',slotnum);

  const sqluserplant = `SELECT user_plant_num AS "key",plant_name, plant_picture FROM user_plant WHERE user_num = ${usernum}`;
  db.query(sqluserplant, usernum, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.post("/plantenroll", async (req, res) => {
  let usernum = req.body.usernum;
  let plantname = req.body.plantname;
  let plantmain = req.body.plantmain;
  //let plantpicture = req.body.plantpicture;
  let plantcharacteristic = req.body.plantcharacteristic;

  const sqlplantenroll =
    "INSERT INTO user_plant (user_num, plant_name, plant_main, plant_characteristic) values(?, ?, ?, ?)";
  db.query(
    sqlplantenroll,
    [usernum, plantname, plantmain, plantcharacteristic],
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        console.log(err);
      }
    }
  );
});

let plantGames;
app.post("/plantgame", async (req, res) => {
  const { message } = req.body;
  console.log(message);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
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
          console.log("context", recommendation);
          return { context: recommendation };
        });
      res.json({ message: plantGames });
    } else {
      res.json({ message: "Error plantgame" });
    }
  } catch (error) {
    console.log(error.response);
  }
});

// 여기는 돈나감!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log("여기는 돈나감!!! ", message);
  const images = [];
  if (!plantRecommendations || !plantRecommendations.length) {
    console.log("plantRecommendations is not defined or is empty");
    return res
      .status(400)
      .json({ message: "plantRecommendations is not defined or is empty" });
  }
  for (let i = 0; i < plantRecommendations.length; i++) {
    const response = await openai.createImage({
      prompt: `${plantRecommendations[i].englishName} plant`,
      n: 1,
      size: "256x256",
    });
    const image_url = response.data.data[0].url;
    images.push(image_url);
  }
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const options = {
        url: images[i],
        dest: "../../sources",
      };
      download
        .image(options)
        .then(({ filename }) => {
          console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
          const imagePath = path
            .join("sources/", path.basename(filename))
            .replace(/\\/g, "/");
          // Save the path to the database
          db.query(
            `UPDATE plant SET img ='${imagePath}' WHERE eng_Name='${plantRecommendations[i].englishName}'`,
            (error, results) => {
              if (error) {
                console.log(error);
                res.status(500).send("Error saving image path to the database");
              }
            }
          );
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error saving image to local file system");
        });
    }
    res.json({
      message: "Image creation complete",
      images: images,
    });
  } else {
    res.status(500).send("Error creating images");
  }
});

// 이미지 path 받아오는 기능
app.get("/imagespath/:plantName", (req, res) => {
  const plant_name = req.params.plantName.replace(/\n/g, "");

  db.query(
    `SELECT img FROM plant WHERE plant_name = '${plant_name}'`,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server Error");
      }

      if (result.length === 0) {
        return res.status(404).send("Plant not found");
      }
      const imgPath = result[0].img;
      console.log("IMGPATH!!", imgPath);
      res.send(imgPath);
    }
  );
});

// 이미지 받아오는 기능
app.get("/images/:plantName", (req, res) => {
  const plant_name = req.params.plantName.replace(/\n/g, "");
  console.log("PlantNameParams", req.params.plantName);
  console.log("PlantName", plant_name);

  // plant_name 대신 영어이름으로 바꾸기
  db.query(
    `SELECT img FROM plant WHERE plant_name = '${plant_name}'`,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server Error");
      }

      if (result.length === 0) {
        return res.status(404).send("Plant not found");
      }

      const imgPath = result[0].img;
      const imgExists = fs.existsSync(imgPath);
      if (!imgExists) {
        return res.status(404).send("Image not found");
      }
      const imgFile = fs.readFileSync(imgPath);
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(Buffer.from(imgFile).toString("base64"));
    }
  );
});

app.post("/saveRating", (req, res) => {
  const starValue = req.body.ratingValue; // starValue 값만 가져오도록 수정
  const userNum = req.body.user_num;
  console.log("starValue from api", starValue);
  console.log("starValue from api", userNum);

  db.query(
    `INSERT INTO user_review (user_num, review)
     SELECT ${userNum} AS user_num, '${starValue}' AS review`,
    (err, data) => {
      if (!err) {
        res.send(data);
      } else {
        console.log(err);
      }
    }
  );
});

app.post("/unsatisfied", async (req, res) => {
  const reasons = req.body.reasons;
  const plantName = req.body.plantName;
  console.log(reasons);
  console.log(plantName);

  // 함수 재사용 할 수 있을듯 => 나중에 하기
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt 메세지 변경 => O
      prompt: `Recommend three different plants and provide descriptions, the name of the plant I previously received recommendations for is ${plantName}, and ${reasons} was not satisfactory, and the answer format is numbered as 1.2.3 and translated into Korean and Korean plant names and English plant names are separated by -, and English plant names and Korean plant descriptions are separated by :`,
      max_tokens: 1000,
      temperature: 0.8,
    });

    console.log(response.data);
    console.log("Unstaisfied");

    if (response.data && response.data.choices) {
      plantRecommendations = response.data.choices[0].text
        .trim()
        .split(/\d+\./)
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          const [name, plant_characteristic] = (recommendation || "")
            .trim()
            .split(/:\s+/);
          const [korName, englishName] = name.trim().split(" - ");
          return {
            korName: korName,
            englishName: englishName,
            plant_characteristic,
          };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert =
        "INSERT IGNORE INTO plant(plant_name, eng_name, plant_characteristic) VALUES (?, ?, ?)";
      plantRecommendations.forEach((recommendation) => {
        db.query(
          sqlInsert,
          [
            recommendation.korName,
            recommendation.englishName,
            recommendation.plant_characteristic || "",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      res.json({ message: plantRecommendations });
    } else {
      res.json({ message: "Error fetching plant recommendations" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/similar", async (req, res) => {
  const plantName = req.body.plantName;

  // 함수 재사용 할 수 있을듯 => 나중에 하기
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt 메세지 변경 =>
      prompt: `Please recommend three similar plants to the one I previously received recommendations for and successfully grew, named ${plantName}, and the answer format is numbered as 1.2.3 and translated into Korean and Korean plant names and English plant names are separated by -, and English plant names and Korean plant descriptions are separated by :`,
      max_tokens: 1000,
      temperature: 0.8,
    });

    console.log(response.data);
    console.log("Unstaisfied");

    if (response.data && response.data.choices) {
      plantRecommendations = response.data.choices[0].text
        .trim()
        .split(/\d+\./)
        .filter((recommendation) => recommendation)
        .map((recommendation) => {
          const [name, plant_characteristic] = (recommendation || "")
            .trim()
            .split(/:\s+/);
          const [korName, englishName] = name.trim().split(" - ");
          return {
            korName: korName,
            englishName: englishName,
            plant_characteristic,
          };
        });

      // MySQL 데이터베이스에 데이터 삽입
      const sqlInsert =
        "INSERT IGNORE INTO plant(plant_name, eng_name, plant_characteristic) VALUES (?, ?, ?)";
      plantRecommendations.forEach((recommendation) => {
        db.query(
          sqlInsert,
          [
            recommendation.korName,
            recommendation.englishName,
            recommendation.plant_characteristic || "",
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });

      res.json({ message: plantRecommendations });
    } else {
      res.json({ message: "Error fetching plant recommendations" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getbeforepick", async (req, res) => {
  let plantpicture = req.body.usernum;

  const sqluserplant = `SELECT user_pick FROM user_review WHERE user_num = '${plantpicture}' ORDER BY user_review_num DESC LIMIT 1`;
  db.query(sqluserplant, plantpicture, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log(err);
    }
  });
});

app.listen(8800, () => {
  console.log("Connected...");
});
