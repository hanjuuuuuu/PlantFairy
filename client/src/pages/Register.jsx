import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../design/register.css';
import logo from '../img/logo.png';

const Register = () => {
  const [inputs, setInputs] = useState({
    user_id: '',
    user_pw: '',
    user_name: '',
    user_nickname: '',
    user_email: '',
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      await axios.post('http://localhost:8800/api/auth/register', inputs);
      navigate('/login');
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className='App'>
      <div className='form'>
        <img src={logo} alt='My Image' width='160' height='60' />
        <div className='joinBox'>
          <form>
            <div className='joinBox2'>
              <address> 아이디 * </address>
              <br></br>
              <label htmlFor='user_id'>아이디</label>
              <input type='text' placeholder='아이디' name='user_id' onChange={handleChange} />
              <br></br>
              <br></br>

              <address> 패스워드 * </address>
              <br></br>
              <label htmlFor='password'>패스워드</label>
              <input type='user_pw' placeholder='패스워드' name='user_pw' onChange={handleChange} />
              <br></br>
              <br></br>

              {/* <address> 패스워드 확인 * </address>
            <br></br>
            <label for='userPw2'>패스워드 확인</label>
            <input type='password' id='userPw2' placeholder='패스워드 확인' />
            <br></br>
            <br></br> */}

              <address> 이름 * </address>
              <br></br>
              <label htmlFor='user_name'>이름</label>
              <input type='text' placeholder='이름' name='user_name' onChange={handleChange} />
              <br></br>
              <br></br>

              <address> 닉네임 * </address>
              <br></br>
              <label htmlFor='user_nickname'>닉네임</label>
              <input type='text' placeholder='닉네임' name='user_nickname' onChange={handleChange} />
              <br></br>
              <br></br>

              <address> 이메일 </address>
              <br></br>
              <label htmlFor='user_email'>이메일</label>
              <input type='email' placeholder='이메일' name='user_email' onChange={handleChange} />
              <br></br>
              <br></br>

              {/* <address> 나이 </address>
            <br></br>
            <label for='user_age'>나이</label>
            <input type='text' id='user_age' placeholder='나이' name='user_age' onChange={handleChange} />
            <br></br>
            <br></br> */}
            </div>
            {/* <address> 성별 </address>
          <label></label>
          <input type='radio' name='userGender' value='남' /> 남<label></label>
          <input type='radio' name='userGender' value='여' /> 여<br></br> */}

            <button onClick={handleSubmit}>회원가입</button>
            <div className='link'>
              이미 계정이 있으십니까? &nbsp;
              <Link to='/login'>로그인</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
