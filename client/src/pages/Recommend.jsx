import { Form, Radio, Button, Modal, Card, Col, Row, Space, Table } from 'antd';
import React, { useState } from 'react';
import '../design/recommend.css';
import axios from 'axios';

const App = () => {
  /**
   * 페이지에서 사용하는 상태변수
   */

  const [onExperience, setOnExperience] = useState(false);
  const [onTime, setOnTime] = useState(false);
  const [onAddress, setOnAddress] = useState(false);
  const [onSize, setOnSize] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [onFunctions, setOnFunctions] = useState(false);
  const [experience, setExperience] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [size, setSize] = useState('');
  const [light, setLight] = useState('');
  const [functions, setFunctions] = useState('');
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [recommendPlant, setrecommendPlant] = useState([]);

  /**
   *
   *  화면에서 사용하는 이벤트를 정의
   */
  const handleExperienceButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setExperience('');
    else setExperience('초보자가');
    setOnExperience(true);
  };

  const handleTimeButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setTime('주기적으로 참여하며');
    else {
      setTime('체계적인 관리없이');
    }
    setOnTime(true);
  };

  const handleAddressButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setAddress('실내에서 키우고');
    else {
      setAddress('실외에서 키우고');
    }
    setOnAddress(true);
  };

  const handleSizeButton = (event) => {
    const name = event.target.value;
    if (name === '크다') setSize('큰 크기의');
    else if (name === '중간') {
      setSize('중간 크기의');
    } else {
      setSize('작은 크기의');
    }
    setOnSize(true);
  };

  const handleLightButton = (event) => {
    const name = event.target.value;
    if (name === '많다') setLight('빛을 많이 받는');
    else if (name === '적당하다') {
      setLight('빛을 적당히 받는');
    } else {
      setLight('빛을 적게 받는');
    }
    setOnLight(true);
  };

  const handleFunctionsButton = (event) => {
    const name = event.target.value;
    if (name === '공기정화') {
      setFunctions('공기정화용');
    } else if (name === '장식') {
      setFunctions('장식용');
    } else if (name === '둘다'){
      setFunctions('공기정화용이면서 장식용인');
    } else {
      setFunctions('');
    }
    setOnFunctions(true);
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {    //식물 등록 버튼 누르면 userplant 테이블에 저장 후 메인페이지로 이동
    axios.post("http://localhost:8800/plantenroll",
      {plantname: "sunflower"}
    )
    .then((response)=> {
        alert("등록되었습니다");
        console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const text = `${experience} ${time} ${address} ${size} ${light} ${functions}`;
  console.log('text: ', text);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8800/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message));
  };

  // const columns = [
  //   {
  //       title: '이름',
  //       dataIndex: 'plant.name',
  //       key: 'name',
  //       render: (text) => <a>{text}</a>,
  //   },
  //   {
  //       title: '특성',
  //       dataIndex: 'plant_characteristic',
  //       key: 'characteristic',
  //   },
  //   {
  //       title: '키우기 난이도',
  //       key: 'plant_level',
  //       render: (text, record, index) => (
  //           <Space size="middle">
  //               <Button record={record} onClick={showModal} >수정</Button> 
  //               <Button record={record} onClick={showModal} >삭제</Button> 
  //           </Space>
  //       ),
  //   },
  //   {
  //     title: '사진',
  //     dataIndex: 'plant_picture'
  //   }
  //   ];


  // '-' 이거 split
  return onFunctions ? (
    <div>
      <form onSubmit={handleSubmit}>
        <button className='btn' type='submit' value={`${text}`} onClick={() => setMessage(`${text}`)}>
          결과를 보시겠습니까?
        </button>
      </form>
      <p>
        {Array.isArray(response) &&
          response.map((plant) => (
            <div key={plant.name}>
              <Button key={plant.name} className='recbtn' onClick={showModal}>{plant.name}</Button>
              <Modal 
                  title="식물요정" 
                  open={open} 
                  onOk={handleOk} 
                  onCancel={handleCancel}
                  footer={[
                    <Button key="enroll" onClick={handleOk}>
                      등록
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                      취소
                    </Button>
                  ]}
                >
                <p className='enroll'>이 식물을 키우시겠습니까?</p>
              </Modal>
              <br></br>
              <div>{plant.context}</div>
              <br></br>
            </div>
          ))}
      </p>
    </div>
  )
 : onLight ? (
    <div className='Functions'>
      <p>원하는 식물의 기능이 있나요?</p>
      <div>
        <button className='btn' value='공기정화' onClick={handleFunctionsButton}>
          공기 정화
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='장식' onClick={handleFunctionsButton}>
          장식
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='둘다' onClick={handleFunctionsButton}>
          둘 다 원해요
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='상관없어요' onClick={handleFunctionsButton}>
          상관없어요
        </button>
      </div>{' '}
    </div>
  ) : onSize ? (
    <div className='Light'>
      <p>광량 조건은 어떻게 되나요?</p>
      <div>
        <button className='btn' value='많다' onClick={handleLightButton}>
          많다
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='적당하다' onClick={handleLightButton}>
          적당하다
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='적다' onClick={handleLightButton}>
          적다
        </button>
      </div>
    </div>
  ) : onAddress ? (
    <div className='Size'>
      <p>원하는 식물의 크기가 있나요?</p>
      <div>
        <button className='btn' value='크다' onClick={handleSizeButton}>
          크다
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='중간' onClick={handleSizeButton}>
          중간
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='작다' onClick={handleSizeButton}>
          작다
        </button>
      </div>
    </div>
  ) : onTime ? (
    <div className='Address'>
      <p>식물을 키우는 장소는 어디인가요?</p>
      <div>
        <button className='btn' value='yes' onClick={handleAddressButton}>
          실내
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='no' onClick={handleAddressButton}>
          실외
        </button>
      </div>
    </div>
  ) : onExperience ? (
    <div className='Time'>
      <p>식물 관리에 참여할 수 있는 시간이 얼마나 되나요?</p>
      <div>
        <button className='btn' value='yes' onClick={handleTimeButton}>
          주기적으로 참여 가능
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='no' onClick={handleTimeButton}>
          체계적인 관리 없이도 잘 자랐으면 좋겠음
        </button>
      </div>
    </div>
  ) : (
    <div className='Experience'>
      <p>식물을 키워본 적이 있으신가요?</p>
      <div>
        <button className='btn' value='yes' onClick={handleExperienceButton}>
          yes
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='no' onClick={handleExperienceButton}>
          no
        </button>
      </div>
    </div>
  );
};

export default App;
