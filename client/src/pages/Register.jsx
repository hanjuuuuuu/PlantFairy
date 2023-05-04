import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../design/register.css';
import image11 from '../img/image11.png';

const Register = () => {
  const [inputs, setInputs] = useState({
    user_id: '',
    password: '',
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
    console.log(inputs)
    try {
      await axios.post('http://localhost:8800/api/auth/register', inputs);
      navigate('/login');
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className='App'>
      <img src={image11} alt='My Image' width='100' height='100' />
      <h1> 식물요정 </h1>

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
            <input type='password' placeholder='패스워드' name='password' onChange={handleChange} />
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
          <br></br>
          <button onClick={handleSubmit}>회원가입</button>
          <div className='link'>
            이미 계정이 있으십니까?
            <Link to='/login'>로그인</Link>
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div className='auth'>
  //     <h1>Register</h1>
  //     <form>
  //       <input required type='text' placeholder='username' name='username' onChange={handleChange} />
  //       <input required type='email' placeholder='email' name='email' onChange={handleChange} />
  //       <input required type='password' placeholder='password' name='password' onChange={handleChange} />
  //       <button onClick={handleSubmit}>Register</button>
  //       {err && <p>{err}</p>}
  //       <span>
  //         Do you have an account? <Link to='/login'>Login</Link>
  //       </span>
  //     </form>
  //   </div>
  // );
};

export default Register;
