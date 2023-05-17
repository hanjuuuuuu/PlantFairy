import '../design/mypage.css';
import image11 from '../img/image11.png';
import { Table } from 'antd';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext.js';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Info = () => {
  const { currentUser } = useContext(AuthContext);
  const [err, setError] = useState(null);
  const [userPlantInfo, setUserPlantInfo] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/auth/logout');
      navigate('/');
    } catch (err) {
      setError(err.response.data);
    }
  };

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 출력
    axios
      .post('http://localhost:8800/plantpicture', { usernum: currentUser.user_num })
      .then((response) => {
        const plant_name = response.data[0].plant_name;
        console.log('MyPage Onuser22');

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

  useEffect(() => {
    //console.log('Onuser333');
    async function getTableData() {
      const data0 = await onUserPlantPrint();
      setUserPlantInfo(data0);
    }
    getTableData();
  }, []);

  return (
    <div className='App'>
      {/* 헤더 */}
      <img src={image11} alt='My Image' width='100' height='100' />
      <h1> 마이 페이지 </h1>
      <br></br>
      <br></br>

      {/* 메인 */}
      <div className='box'>
        {/* <div className='quick1'>{ <h3> 내 프로필 {currentUser.user_profile}</h3> }</div> */}

        <div className='printImg'></div>

        <div className='text'>
          <div className='space'>
            <h4> 닉네임 : {currentUser.user_nickname} </h4>
            <h5> 이름 : {currentUser.user_name} </h5>
            {/* <h6> 나이 : {currentUser.user_profile}</h6>
            <h7> 성별 : </h7> */}
            <p>
              {' '}
              <h8> 이메일 : {currentUser.user_email}</h8>{' '}
            </p>
          </div>
        </div>
      </div>

      <div className='level'>
        <h10> 레벨 : </h10>
        <br></br>
        <br></br>
        <h11> 포인트 : </h11>
      </div>

      <div className='box2'>
        <button onClick={handleSubmit}> 로그아웃 </button>
      </div>
    </div>
  );
};

export default Info;
