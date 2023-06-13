import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Modal, Radio } from 'antd';
import axios from 'axios';
import '../design/main.css';
import { useLocation, Link, NavLink, useNavigate } from 'react-router-dom';
//import App from './App.js';
import Recommend from './Recommend.jsx';
import Community from './Community.jsx';
import logo from '../img/logo.png';
import Info from './MyPage.jsx';
import NewRecommend from './NewReccomend.jsx';
import Todo from './Todo';
import { makeRequest } from '../axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import fairy from '../img/fairy.png';
import { AuthContext } from '../context/authContext';

//import img from '../../../api/sources/'

const Main = () => {
  /**
   *  페이지에서 사용하는 상태변수
   */

  const [isRecommend, setIsRecommend] = useState(false);
  const [isNewRecommend, setIsNewRecommend] = useState(false);
  const [isInfo, setIsInfo] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
  const [userPlantEnroll0, setUserPlantEnroll0] = useState('+');
  const [userPlantEnroll1, setUserPlantEnroll1] = useState('+');
  const [userPlantEnroll2, setUserPlantEnroll2] = useState('+');
  const [userPlantEnroll3, setUserPlantEnroll3] = useState('+');
  const [userPlantEnroll4, setUserPlantEnroll4] = useState('+');
  const [userPlantEnroll1name, setUserPlantEnroll1name] = useState('');
  const [userPlantEnroll2name, setUserPlantEnroll2name] = useState('');
  const [userPlantEnroll3name, setUserPlantEnroll3name] = useState('');
  const [userPlantEnroll4name, setUserPlantEnroll4name] = useState('');
  const [buttonValue, setButtonValue] = useState('');

  const [userPlantInfo, setUserPlantInfo] = useState(null);
  const [plantImage, setPlantImage] = useState([]);
  const [recommendPlant, setrecommendPlant] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [newImgPath, setNewImagePath] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [err, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);

  /**
   *  화면에서 사용하는 이벤트를 정의
   */

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

  const onClick = (e) => {
    console.log('click', e);
  };

  const onRecommend = (e) => {
    //슬롯 + 누르면 추천페이지로 이동, 버튼에 따라 식물 출력 자리 지정
    // name: button 번호
    const name = e.target.value;
    setButtonValue(name);
    setIsRecommend(true);
  };

  const onNewRecommend = (e) => {
    const name = e.target.value;
    setButtonValue(name);
    setIsNewRecommend(true);
  };

  const onInfo = () => {
    navigate('/info');
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate('/community');
  };

  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate('/todo', { state: state });
  };

  const onRandom = () => {
    // 페이지로 이동
    navigate('/random', { state: state });
  };

  const showModal = () => {
    //메인식물 고르는 모달 창 띄우기
    setIsModalOpen(true);
  };

  const handleOK = (e) => {
    //메인식물 고르고 확인버튼 눌렀을 때
    console.log(e.target.value);
    userMainPlant(e.target.value);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
  ];

  //login에서 user_num 받아오기
  const { state } = useLocation();
  console.log('usernum', state);
  console.log('mainbutton', buttonValue);

  const userMainPlant = () => {
    //메인 식물 변경할 수 있게하기(main 0으로 바꾸기)
    axios.post('http://localhost:8800/plantall', { usernum: state }).then((res) => {
      console.log('userPlantALL ------------ ');
      setUserPlantEnroll1name(res.data[0].plant_name);
      console.log('DATA ___ ', res.data[0]);
      setUserPlantEnroll2name(res.data[1]);
      setUserPlantEnroll3name(res.data[2]);
      setUserPlantEnroll4name(res.data[3]);
    });
  };

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
    axios
      .post('http://localhost:8800/plantpicture', { usernum: state })
      .then((response) => {
        const plant_name = response.data[0].plant_name;
        console.log('PlantNAME: ', plant_name);

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
        //setUserPlantEnroll1(res.data[res.data.length - 1].plant_picture);
        setUserPlantEnroll1name(res.data[res.data.length - 1].plant_name);
        console.log('slot', res.data[res.data.length - 1]);
        //setUserPlantInfo(res.data);       //메인 식물 이름, 특성, 키우기 난이도
      })
      .catch((err) => {
        console.log(err);
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

  useEffect(() => {
    onUserPlantSlot();
  });

  return isRecommend ? (
    <Recommend usernum={state} buttonValue={buttonValue} />
  ) : isNewRecommend ? (
    <NewRecommend usernum={state} buttonValue={buttonValue} />
  ) : (
    <>
      <div className='main_nav'>
        <div className='main_logo'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but'>
          <Link to='/main'> 메인 페이지 </Link>
          <Link to='/community'> 커뮤니티 </Link>
          <Link to='/todo'> to-do list </Link>
          <Link to='#'> 식물 성향 테스트 </Link>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <section className='out'>
        <div className='printImg'> </div>
        {/* <Button className='slot' onClick={showModal}>
            {' '}
            {userPlantEnroll0}{' '}
          </Button> */}
        <Modal title='메인 식물로 등록할 식물을 골라주세요' open={isModalOpen} onOk={handleOK} onCancel={handleCancel}>
          <Radio.Group>
            <Radio value={userPlantEnroll1name} onClick={onclick}>
              {userPlantEnroll1name}
            </Radio>
            <Radio value={userPlantEnroll2name} onClick={onclick}>
              {userPlantEnroll2name}
            </Radio>
            <Radio value={userPlantEnroll3name} onClick={onclick}>
              {userPlantEnroll3name}
            </Radio>
            <Radio value={userPlantEnroll4name} onClick={onclick}>
              {userPlantEnroll4name}
            </Radio>
          </Radio.Group>
        </Modal>

        <h1> 닉네임 : {currentUser.user_nickname} </h1>
        <div className='tab'>
          <Table className='tableprint' columns={columns} pagination={false} dataSource={userPlantInfo} size='middle' />
        </div>

        <div className='style'>
          <p> 이름 : {currentUser.user_name} </p>
          <p> 이메일 : {currentUser.user_email} </p>
          <p> 레벨 : </p>
          <p> 포인트 : </p>

          <button onClick={handleSubmit} className='logout'>
            {' '}
            로그아웃{' '}
          </button>

          <h1> 레벨이 올라가면 슬롯이 확장됩니다! </h1>
          <Button value='1' className='slots1' onClick={onRecommend}>
            {' '}
            {userPlantEnroll1}{' '}
          </Button>
          <Button value='2' className='slots2' onClick={onNewRecommend}>
            {' '}
            {userPlantEnroll2}{' '}
          </Button>
          <Button value='3' className='slots3' disabled onClick={onRecommend}>
            {' '}
            {userPlantEnroll3}{' '}
          </Button>
          <Button value='4' className='slots4' disabled onClick={onRecommend}>
            {' '}
            {userPlantEnroll4}{' '}
          </Button>
        </div>

        <div className='event'>
          <Button value='5'>식물 성장 모습</Button>
          <img src={fairy} alt='My Image' />
        </div>
      </section>
    </>
  );
};

export default Main;
