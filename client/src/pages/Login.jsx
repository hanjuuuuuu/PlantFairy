import React, { useState } from 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import '../design/login.css';
import logo from '../img/logo.png';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    user_pw: '',
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
      let getUserNum = await login(inputs);
      console.log('user_num: ', getUserNum);
      navigate('/main', { state: getUserNum });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  return (
    <div className='App'>
      <div className='loginBox'>
        <img src={logo} alt='My Image' width='160' height='60' />
        <address>식물요정 웹 사이트에 오신 걸 환영합니다.</address>
        <br></br>
        <br></br>

        <form>
          <div className='loginBox2'>
            <label htmlFor='user_id'></label>
            <input required type='text' id='user_id' placeholder='아이디' name='user_id' onChange={handleChange} />
            <label htmlFor='password'></label>
            <input required type='password' id='user_pw' placeholder='패스워드' name='user_pw' onChange={handleChange} />
          </div>

          <div className='loginBox3'>
            <button onClick={handleSubmit}>로그인</button>
          </div>
          {err && <p>{err}</p>}

          <br></br>
          <div className='link'>
            회원가입하시겠습니까? &nbsp;
            <Link to='/register'>회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;