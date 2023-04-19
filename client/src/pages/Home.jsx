import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../design/home.css';
import image11 from '../img/image11.png';

function Home() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className='App'>
      <div className='top'>
        <header></header>

        <br></br>

        <main>
          <form>
            <img src={image11} alt='My Image' width='100' height='100' />
            <h2> 로그인 하시겠습니까? </h2>
            <button type='submit' onClick={navigateToLogin}>
              로그인
            </button>
            <div className='space'>
              <h3> / </h3>
            </div>
            <button type='submit' onClick={navigateToRegister}>
              회원가입
            </button>
          </form>
        </main>

        <br></br>

        {/* <img src={image2} alt="My Image" width="100" height="120"/> */}

        {/*  <center> <img src={image2} alt="My Image" width="100" height="120"/> </center> */}

        <footer></footer>
      </div>
    </div>
  );
}

export default Home;
