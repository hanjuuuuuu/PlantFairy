import { db } from '../db.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

export const getComments = (req, res) => {
  const q = 'SELECT c.*, user_num, user_nickname FROM comments AS c JOIN user AS u ON (u.user_num = c.userid) WHERE c.postid = ? ORDER BY c.createdAt DESC';

  db.query(q, [req.query.postid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  jwt.verify(token, 'jwtkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    const q = 'INSERT INTO comments (`desc`, `createdAt`, `userid`, `postid`) VALUES (?)';

    const values = [req.body.desc, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), userInfo.id, req.body.postid];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('Comments has been created');
    });
  });
};
