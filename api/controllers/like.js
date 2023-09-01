import { db } from '../db.js';
import jwt from 'jsonwebtoken';

export const getLikes = (req, res) => {
  const q = 'SELECT userid FROM likes WHERE postid = ?';

  db.query(q, [req.query.postid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userid));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'INSERT INTO likes (`userid`, `postid`) VALUES (?)';
    const values = [userInfo.id, req.body.postid];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('이미 좋아요를 누른 게시물입니다.');
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'DELETE FROM likes WHERE `userid` = ? AND `postid` = ?';

    db.query(q, [userInfo.id, req.query.postid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('좋아요가 사라진 게시글입니다.');
    });
  });
};
