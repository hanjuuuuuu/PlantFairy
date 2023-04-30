import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'antd';
import axios from 'axios';
import '../design/main.css';
import { useLocation } from 'react-router-dom';
//import App from './App.js';
import Recommend from './Recommend.jsx';
import Community from './Community.jsx';
import Info from './MyPage.jsx';

const Main = () => {
  /**
   *  페이지에서 사용하는 상태변수
   */
  const [isRecommend, setIsRecommend] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
  const [userPlantEnroll0, setUserPlantEnroll0] = useState('+');
  const [userPlantEnroll1, setUserPlantEnroll1] = useState('+');
  const [userPlantEnroll2, setUserPlantEnroll2] = useState('+');
  const [userPlantEnroll3, setUserPlantEnroll3] = useState('+');
  const [userPlantEnroll4, setUserPlantEnroll4] = useState('+');
  const [buttonValue, setButtonValue] = useState('');

  const [userPlantInfo, setUserPlantInfo] = useState(null);
  const [plantImage, setPlantImage] = useState([]);
  const [recommendPlant, setrecommendPlant] = useState('');

  /**
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
      title: '식물 특성',
      dataIndex: 'plant_characteristic',
    },
    {
      title: '키우기 난이도',
      dataIndex: 'plant_level',
    },
  ];

  //login에서 user_num 받아오기
  const { state } = useLocation();
  console.log('usernum', state);
  console.log('mainbutton', buttonValue);

  const userMainPlant = () => {
    //메인 식물 변경할 수 있게하기(main 0으로 바꾸기)
    axios.post('http://localhost:8800/plantall', { userplantnum: state }).then((res) => {});
  };

  // const onUserPlantPrint = () => {
  //   //user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
  //   axios
  //     .post('http://localhost:8800/plantpicture', { usernum: state })
  //     .then((response) => {
  //       const plant_name = response.data[0].plant_name;
  //       //const plant_picture = response.data[0].plant_picture;

  //       //setUserPlantEnroll0(plant_picture); //메인 식물 이미지
  //       //console.log('mainplant', response.data[0]);
  //       setUserPlantInfo(response.data); //메인 식물 이름, 특성, 키우기 난이도
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
    axios
      .post('http://localhost:8800/plantpicture', { usernum: state })
      .then((response) => {
        const plant_name = response.data[0].plant_name;

        setUserPlantInfo(response.data); // 메인 식물 이름, 특성, 키우기 난이도
        userPlantEnroll(plant_name); // 해당 식물의 이미지 출력
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const userPlantEnroll = (plant_name) => {
    axios
      .get(`http://localhost:8800/images/${plant_name}`)
      .then((response) => {
        const imagePath = `${response.data}`;
        const image = document.createElement('img');
        image.src = `data:image/png;base64,${response.data}`;
        document.querySelector('div.printImg').appendChild(image);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUserPlantSlot = () => {
    //user_plant 테이블에서 사용자의 식물 정보 가져와 슬롯별 식물 이미지 출력
    axios
      .post('http://localhost:8800/plantslot', { usernum: state, slotnum: buttonValue })
      .then((res) => {
        //setUserPlantEnroll0(res.data[0].plant_picture);     //메인 식물 이미지
        //setUserPlantEnroll1(res.data[0].plant_picture);
        console.log('slot', res.data[0]);
        //setUserPlantInfo(res.data);       //메인 식물 이름, 특성, 키우기 난이도
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  async function getTableData() {
    const data0 = await onUserPlantPrint();
    // const data1 = await onUserPlantSlot();
    setUserPlantInfo(data0);
    //setUserPlantEnroll1(data1);
  }
  // getTableData();
  // }, []);

  // useEffect(() => {
  //   onUserPlantSlot();
  // });

  // const handleClick = () => {
  //   //const encodedString = encodeURIComponent('고사리');
  //   axios
  //     .get(`http://localhost:8800/images/hi`) // 식물 이름을 넣어줍니다.
  //     .then((response) => {
  //       // console.log(response.data); // 요청 결과를 콘솔에 출력합니다.
  //       const image = document.createElement('img');
  //       image.src = `data:image/png;base64,${response.data}`;
  //       document.body.appendChild(image);
  //     })
  //     .catch((error) => {
  //       console.error(error); // 에러가 발생하면 콘솔에 출력합니다.
  //     });
  // };

  return isCommunity ? (
    <Community />
  ) : isInfo ? (
    <Info />
  ) : isRecommend ? (
    <Recommend usernum={state} buttonValue={buttonValue} />
  ) : (
    <div className='main'>
      <br></br>
      <h2>식물요정</h2>
      <br></br>
      <div>메인페이지</div>
      <br></br>

      <div className='printImg'></div>
      <div>
        <Table className='tableprint' columns={columns} pagination={false} dataSource={userPlantInfo} size='middle' />
      </div>
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
      <div style={{ marginLeft: '50%' }}>레벨이 올라가면 슬롯이 확장됩니다!</div>
      <Button value='1' className='slots' onClick={onRecommend}>
        {' '}
        {userPlantEnroll1}{' '}
      </Button>
      <Button value='2' className='slots' disabled onClick={onRecommend}>
        {' '}
        {userPlantEnroll2}{' '}
      </Button>
      <Button value='3' className='slots' disabled onClick={onRecommend}>
        {' '}
        {userPlantEnroll3}{' '}
      </Button>
      <Button value='4' className='slots' disabled onClick={onRecommend}>
        {' '}
        {userPlantEnroll4}{' '}
      </Button>
    </div>
  );
};

export default Main;
