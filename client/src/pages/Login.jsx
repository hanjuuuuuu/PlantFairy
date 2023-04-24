import React, { useState } from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

import '../design/login.css';
// import '../common.css';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate('/main');
    } catch (err) {
      setError(err.response.data);
    }
  };

  return  (
    <div className="App">
      <div className = "loginBox">
    <img  alt="My Image" width="100" height="100"/> 
    
    <h1> 식물요정 </h1>
  <address>
    <p> 식물요정 웹 사이트에 오신 걸 환영합니다. </p>
  </address>

  <form>
        <label for = "userId"></label>
        <input type = "text" id = "userId" placeholder="아이디" />
        <p>
            <label for = "userPw"></label>
        <input type = "password" id = "userPw" placeholder="패스워드" />
        </p>
        <button type="submit">로그인</button>
        
      <footer>
        <div className="link">
          회원가입 하시겠습니까? 
        <a href="#">
            회원가입
          </a>

      </div>
    </footer>
      </form>


    </div>
    </div>
  );
};

export default Login;
