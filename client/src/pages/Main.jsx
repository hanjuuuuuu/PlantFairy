import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';
import '../design/main.css';
//import App from './App.js';
import Recommend from './Recommend.jsx';
import Community from './Community.jsx';
import Info from './MyPage.jsx';

//메인페이지. 키우는 식물 슬롯들이 출력되고 +버튼을 누르면 식물을 추천해주고 등록할 수 있게 한다.

// function getItem(label, key, icon, children, type) {
//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//     };
// }
// const items = [
//     getItem('마이페이지', '마이페이지'), getItem('커뮤니티', '커뮤니티'),
//     getItem('To-do list', 'To-do list'), getItem('로그아웃', '로그아웃')
// ];

const Main = () => {
  /**
   *  페이지에서 사용하는 상태변수
   */
  const [isRecommend, setIsRecommend] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
  const [userPlantInfo, setUserPlantInfo] = useState([]);

  /**
   *
   *  화면에서 사용하는 이벤트를 정의
   */
  const onClick = (e) => {
    console.log('click', e);
  };

  const onRecommend = () => {
    //슬롯 + 누르면 추천페이지로 이동
    setIsRecommend(true);
  };
  const onInfo = () => {
    //마이 페이지로 이동
    setIsInfo(true);
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    setIsCommunity(true);
  };

  const columns = [
    {
      title: '식물 이름',
      dataIndex: 'plant_name',
    },
    {
      title: '식물 종류',
      dataIndex: 'plant_kind',
    },
    {
      title: '키우기 난이도',
      dataIndex: 'plant_level',
    },
  ];

  const data = [
    {
      key: '1',
      plant_name: '산세베이리아',
      plant_kind: '다육이',
      plant_level: '초보가 키울만한',
    },
  ];

  const onUserPlantPrint = (userplantnum) => {
    //db에서 식물 정보 가져와 출력
    axios
      .post('/', { userplantnum: userplantnum })
      .then((res) => {
        console.log(res.data);
        setUserPlantInfo(res.data);
      })
      .catch((err) => {
        console.log(err.res);
      });
  };

  return isCommunity ? (
    <Community />
  ) : isInfo ? (
    <Info />
  ) : isRecommend ? (
    <Recommend />
  ) : (
    <div>
      <br></br>
      <h2>식물요정</h2>
      <br></br>
      <div>메인페이지</div>
      <br></br>
      <span>
        <button className='slot'> db</button>
        <Table columns={columns} pagination={false} dataSource={data} size='middle' />
      </span>
      <menu className='btnmenu'>
        <button className='menubtn' onClick={onInfo}>
          마이페이지
        </button>
        <br></br>
        <button className='menubtn' onClick={onCommunity}>
          커뮤니티
        </button>
        <br></br>
        <button className='menubtn'>To-do list</button>
        <br></br>
        <button className='menubtn'>로그아웃</button>
      </menu>
      <br></br>
      <br></br>
      <Button className='slots' onClick={onRecommend}>
        {' '}
        +{' '}
      </Button>
      <Button className='slots' disabled>
        {' '}
        +{' '}
      </Button>
      <Button className='slots' disabled>
        {' '}
        +{' '}
      </Button>
      <Button className='slots' disabled>
        {' '}
        +{' '}
      </Button>
    </div>
  );
};

export default Main;
