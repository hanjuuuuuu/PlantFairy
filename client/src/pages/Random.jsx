import React, { useEffect, useState, useContext } from 'react';
import '../design/random.css';
import axios from 'axios';
import { Typography, Button, Radio } from 'antd';
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import FunGame from './FunGame';
import ScaryGame from './ScaryGame';
import logo from '../img/logo.png';
import { AuthContext } from '../context/authContext';

const Random = () => {
  /**
   * 페이지에서 사용하는 상태변수
   */
  const [fun, setFun] = useState(false);
  const [scary, setScary] = useState(false);

  //**
  /*
    /*  화면에서 사용하는 이벤트를 정의
   */
  const navigate = useNavigate();

  const onInfo = () => {
    //마이 페이지로 이동
    navigate('/info', { state: state });
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate('/community', { state: state });
  };
  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate('/todo', { state: state });
  };

  //usernum 받아오기
  const { state } = useLocation();
  console.log('usernum', state);

  const userFunGame = () => {
    setFun(true);
  };

  const userScaryGame = () => {
    setScary(true);
  };

  const [inputs, setInputs] = useState({
    username: '',
    user_pw: '',
  });

  const [err, setError] = useState(null);
  const { login } = useContext(AuthContext);

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

  return scary ? (
    <ScaryGame />
  ) : fun ? (
    <FunGame />
  ) : (
    <>
      <div className='main_nav_random'>
        <div className='main_logo_random'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_random'>
          <Link to='/main'> 메인 페이지 </Link>
          <Link to='/community'> 커뮤니티 </Link>
          <Link to='/todo'> to-do list </Link>
          <Link to='/random'> 식물 성향 테스트 </Link>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className='ran'>
        <Typography.Title className='title' level={4}>
          {' '}
          성향에 맞는 식물을 추천해 드립니다 !{' '}
        </Typography.Title>
        <h1 className='theme'>원하는 질문 테마를 선택해주세요.</h1>
        <div>
          <Button className='choose' onClick={userScaryGame}>
            {' '}
            공포{' '}
          </Button>
          <br></br>
          <Button className='choose1' onClick={userFunGame}>
            {' '}
            재미{' '}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Random;
