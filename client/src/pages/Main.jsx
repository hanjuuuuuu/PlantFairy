import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import axios from 'axios';
import '../design/main.css';
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
  const [userPlantEnroll, setUserPlantEnroll] = useState('');
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
      title: '식물 특성',
      dataIndex: 'plant_characteristic',
    },
    {
      //title: '키우기 난이도',
      //dataIndex: 'plant_level',
    },
  ];


  const onUserPlantPrint = (userplantnum) => {    //user_plant 테이블에서 사용자의 식물 정보 가져와 출력
      axios.post("http://localhost:8800/plantpicture",
      {userplantnum: 12}   //1대신 userplantnum입력
      )
      .then((res)=> {
          console.log(res.data[0].plant_name);    //plant_picture로 변경
          setUserPlantEnroll(res.data[0].plant_name);   //plant_picture로 변경
          console.log(res.data[0]);
          setUserPlantInfo(res.data);   
      })
      .catch((err) => {
          console.log(err.res);
      })
  };

  useEffect(()=> {
      async function getTableData() {
        const data = await onUserPlantPrint(12);
        setUserPlantInfo(data);
      };
      getTableData(); 
  }, [])

  return (isCommunity ? <Community /> :
        isInfo ? <Info /> :
        isRecommend ? 
        <Recommend /> :
        <div>
            <br></br>
            <h2>식물요정</h2>
            <br></br>
            <div>메인페이지</div>
            <br></br>
            <div>
                <Button className="slot"> {userPlantEnroll} </Button>
            </div>
            <div>
                <Table className="tableprint" columns={columns} pagination={false} dataSource={userPlantInfo} size="middle" />
            </div>
            <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
            <br></br>
            <br></br>
            <div style={{marginLeft: '50%'}}>레벨이 올라가면 슬롯이 확장됩니다!</div>
            <Button className="slots" onClick={onRecommend}> + </Button>
            <Button className="slots" disabled onClick={onRecommend}> + </Button>
            <Button className="slots" disabled onClick={onRecommend}> + </Button>
            <Button className="slots"disabled onClick={onRecommend}> + </Button>
        </div>
    );
};

export default Main;
