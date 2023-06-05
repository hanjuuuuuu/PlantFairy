import React, { useEffect, useState } from 'react';
import '../design/random.css';
import axios from 'axios';
import { Typography, Button, Radio } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import FunGame from './FunGame';
import ScaryGame from './ScaryGame';

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

  return scary ? (
    <ScaryGame />
  ) : fun ? (
    <FunGame />
  ) : (
    <div>
      <Typography.Title className='title' level={4}>
        식물 추천
      </Typography.Title>
      <menu className='btnmenu'>
        <button className='menubtn' onClick={onInfo}>
          마이페이지
        </button>
        <br></br>
        <button className='menubtn' onClick={onCommunity}>
          커뮤니티
        </button>
        <br></br>
        <button className='menubtn' onClick={onTodo}>
          To-do list
        </button>
        <br></br>
        <button className='menubtn'>로그아웃</button>
      </menu>
      <p className='theme'>질문 테마 선택</p>
      <div>
        <Button className='choose' onClick={userScaryGame}>
          {' '}
          공포{' '}
        </Button>
        <br></br>
        <Button className='choose' onClick={userFunGame}>
          {' '}
          재미{' '}
        </Button>
      </div>
    </div>
  );
};

export default Random;
