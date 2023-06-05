import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  //CHECK EXISTING USER

  const q = 'SELECT * FROM user WHERE user_id= ? OR user_name = ?';
  console.log(req.body.user_id);
  console.log(req.body.user_name);


  db.query(q, [req.body.user_id, req.body.user_name], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json('User already exists!');

    //Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.user_pw, salt);

    const q = 'INSERT INTO user(`user_id`, `user_name`, `user_nickname`, `password`, `user_email`) VALUES (?)';
    const values = [req.body.user_id, req.body.user_name, req.body.user_nickname, hash, req.body.user_email];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json('User has been created.');
    });
  });
};

export const login = (req, res) => {

  const q = 'SELECT * FROM user WHERE user_id = ?';

  db.query(q, [req.body.user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json('User not found!');
    if (data[0].user_num === undefined) return res.status(500).json('Failed to retrieve user information!');

    //Check password
    console.log(req.body.password, data[0].user_pw);
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].user_pw);


    if (!isPasswordCorrect) return res.status(400).json('Wrong username or password!');

    const token = jwt.sign({ id: data[0].user_num }, 'jwtkey');
    const { user_pw, ...other } = data[0];

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json('User has been logged out.');
};
