import { Button, Modal, Space, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../design/recommend.css';
import axios from 'axios';
import Main from './Main';

const App = ({usernum, buttonValue}) => {
  /**
   * 페이지에서 사용하는 상태변수
   */

  const [isInfo, setIsInfo] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
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
  const [isMain, setIsMain] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [recommendPlant, setrecommendPlant] = useState('');
  const [plantContext, setPlantContext] = useState('');
  const [plantRecommendations, setPlantRecommendations] = useState([]);
  const [image, setImage] = useState('');
  const [plantImages, setPlantImages] = useState([]);

  /**
   *
   *  화면에서 사용하는 이벤트를 정의
   */

  const onInfo = () => {
    //마이 페이지로 이동
    setIsInfo(true);
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    setIsCommunity(true);
  };

  //사용자 경험 수집
  const handleExperienceButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setExperience('experienced person');
    else setExperience('beginner');
    setOnExperience(true);
  };

  //사용자 식물 관리 시간 수집
  const handleTimeButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setTime('Can participate periodically');
    else {
      setTime('hope it grows well without systematic management');
    }
    setOnTime(true);
  };

  //사용자 식물 관리 장소 수집
  const handleAddressButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') setAddress('Indoor');
    else {
      setAddress('Outdoor');
    }
    setOnAddress(true);
  };

  //사용자 식물 크기 수집
  const handleSizeButton = (event) => {
    const name = event.target.value;
    if (name === '크다') setSize('over 1m');
    else if (name === '중간') {
      setSize('30cm~1m size');
    } else {
      setSize('under 30cm');
    }
    setOnSize(true);
  };

  //사용자 식물 광량 조건 수집
  const handleLightButton = (event) => {
    const name = event.target.value;
    if (name === '많다') setLight('receiving a lot of sunlight');
    else if (name === '적당하다') {
      setLight('get enough sunlight');
    } else {
      setLight('less sunlight');
    }
    setOnLight(true);
  };

  //사용자 식물 기능 수집
  const handleFunctionsButton = (event) => {
    const name = event.target.value;
    if (name === '공기정화') {
      setFunctions('for air purification');
    } else if (name === 'for decoration') {
      setFunctions('장식용');
    } else if (name === '둘다'){
      setFunctions('for air purication and decoration');
    } else {
      setFunctions('');
    }
    setOnFunctions(true);
  };

  //main에서 버튼 값 받아오기
  console.log('recommend usernum', usernum);
  console.log('recommend button',buttonValue);

  const showModal = (event) => {
    const value = event.target.value;
    const text = value.split(',');
    console.log(text[0]);
    setrecommendPlant(text[0]);
    setPlantContext(text[1]);
    setOpen(true);
  };

    let plantname;
    let userplantnum;

    //식물이름 가져오기
    const userMainPlant = async() => {     
      axios.post("http://localhost:8800/plantall",
      {usernum: usernum})
      .then((res) => {
        userplantnum = res.data[(res.data.length-1)].key;
        plantname = res.data[(res.data.length-1)].plant_name;
        console.log('recommend page',userplantnum, plantname);
      })
    }

  //식물 등록 버튼 누르면 userplant 테이블에 저장 후 메인페이지로 이동, 식물 투두리스트 todo 테이블에 저장
  const handleOk = async () => {     
    console.log('button',buttonValue)
    axios.post("http://localhost:8800/plantenroll",
      { usernum: usernum,
        plantmain: buttonValue,
        plantname: recommendPlant,
        plantpicture: 'png',
        plantcharacteristic: plantContext,
      }
    )
    .then((response)=> {
        alert("등록되었습니다");
        console.log(response.data);
        setIsMain(true);
        userMainPlant();

      axios.post("http://localhost:8800/rectodo",
      { plantname: recommendPlant,
        userplantnum: userplantnum,
        usernum: usernum
      })
      .then((res) => {
        console.log('todotodotodo',res.data)
      })
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

  const handleSubmit = async (e) => {
    console.log(loading);
    try{
      e.preventDefault();
      setLoading(true);
      const response = await fetch('http://localhost:8800/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      // plant recommendations API call
      //const res1 = await axios.post('http://localhost:8800/recommend', { message });
      //setPlantRecommendations(res1.data.message);

      //plant image creation API call
      // const res2 = await axios.post('http://localhost:8800/', { message });
      // setPlantImages(res2.data.images);

      //.then((res) => res.json())
      const result = await response.json()
      .then((data) => setResponse(data.message), setLoading(false));
  } catch(error){
    window.alert(error);
  }
  };

  useEffect(() => {
      userMainPlant()
  },[])

  
  // '-' 이거 split
  return isMain ? <Main /> :
  onExperience ? onTime ? onAddress? onSize? onLight? onFunctions? loading? (
    <div>
      <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
    <form onSubmit={handleSubmit}>
      <button className='resultbtn' type='submit' value={`${text}`} onClick={() => {setMessage(`${text}`)}}>
        결과를 보시겠습니까?
      </button>
    </form>
    <br></br>
    <br></br>
  <div className='spin'>
  <Space
    direction="vertical"
  >
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
  </Space>
  </div></div>): ( <div>
    <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
    <form onSubmit={handleSubmit}>
      <button className='resultbtn' type='submit' value={`${text}`} onClick={() => {setMessage(`${text}`)}}>
        결과를 보시겠습니까?
      </button>
    </form>
    <br></br>
    <br></br>
    <div>
  {Array.isArray(response) &&
    response.map((plant) => (
      <div className='recommend' key={plant.name}>
        <button value={plant.korName} className='recbtn' onClick={showModal}>{plant.korName}</button>
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
          <h2 className='enroll'>{recommendPlant} 키우시겠습니까?</h2>
        </Modal>
        <br></br>
        <div>{plant.context}</div>
        <br></br>
      </div>
    ))}
</div></div>):(
    <div className='Functions'>
      <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
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
  ) :(
    <div className='Light'>
      <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
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
  ):(
    <div className='Size'>
      <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
      <p>원하는 식물의 크기가 있나요?</p>
      <div>
        <button className='btn' value='크다' onClick={handleSizeButton}>
          크다(1m이상)
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='중간' onClick={handleSizeButton}>
          중간(30cm~1m정도)
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='작다' onClick={handleSizeButton}>
          작다(30cm이하)
        </button>
      </div>
    </div>
  ):(
    <div className='Address'>
      <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
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
  ):(<div className='Time'>
    <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
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
</div>):(<div className='Experience'>
<menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
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
  </div>)
  
};

export default App;
