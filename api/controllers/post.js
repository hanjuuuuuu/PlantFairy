import { db } from '../db.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //   console.log(userId);
    const q = 'SELECT p.*, user_num, user_nickname FROM community AS p JOIN user AS u ON (u.user_num = p.userid) ORDER BY p.createdAt DESC';

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'INSERT INTO community (`desc`, `img`, `createdAt`, `userid`) VALUES (?)';

    const values = [req.body.desc, req.body.img, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), userInfo.id];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Post has been created');
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'DELETE FROM community WHERE `communityid`=? AND `userid` =? ';

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json('Post has been deleted');
      return res.status(403).json('삭제 권한이 없는 게시글입니다.');
    });
  });
};
