import { Button, Modal, Space, Spin } from 'antd';
import React, { useState, useEffect, useContext, Component } from 'react';
import axios from 'axios';
import '../design/recommend.css';
import Main from './Main.jsx';
import { AuthContext } from '../context/authContext.js';
import { useLocation, NavLink, Link } from 'react-router-dom';
import logo from '../img/logo.png';

const App = ({ usernum, buttonValue }) => {
  /**
   * 페이지에서 사용하는 상태변수
   */
  const { currentUser } = useContext(AuthContext);

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

  const [buttonexperience, buttonSetExperience] = useState('');
  const [buttontime, buttonSetTime] = useState('');
  const [buttonaddress, buttonSetAddress] = useState('');
  const [buttonsize, buttonSetSize] = useState('');
  const [buttonlight, buttonSetLight] = useState('');
  const [buttonfunctions, buttonSetFunctions] = useState('');

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
  const [plantname, setPlantName] = useState('');
  const [userplantnum, setUserPlantNum] = useState('');

  const { state } = useLocation();

  const onInfo = () => {
    //마이 페이지로 이동
    setIsInfo(true);
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    setIsCommunity(true);
  };

  /**
   *  화면에서 사용하는 이벤트를 정의
   */
  const handleExperienceButton = (event) => {
    const name = event.target.value;
    if (name === '식물을 키워본 경험 있음') {
      setExperience('experienced person');
      buttonSetExperience(name);
    } else {
      setExperience('초보자');
      buttonSetExperience(name);
    }
    setOnExperience(true);
  };

  const handleTimeButton = (event) => {
    const name = event.target.value;
    if (name === '주기적으로 참여 가능') {
      setTime('Can participate periodically');
      buttonSetTime(name);
    } else {
      setTime('hope it grows well without systematic management');
      buttonSetTime(name);
    }
    setOnTime(true);
  };

  const handleAddressButton = (event) => {
    const name = event.target.value;
    if (name === '실내') {
      setAddress('Indoor');
      buttonSetAddress(name);
    } else {
      setAddress('Outdoor');
      buttonSetAddress(name);
    }
    setOnAddress(true);
  };

  const handleSizeButton = (event) => {
    const name = event.target.value;
    if (name === '크다') {
      setSize('over 1m');
      buttonSetSize(name);
    } else if (name === '중간') {
      setSize('30cm~1m size');
      buttonSetSize(name);
    } else {
      setSize('under 30cm');
      buttonSetSize(name);
    }
    setOnSize(true);
  };

  const handleLightButton = (event) => {
    const name = event.target.value;
    if (name === '많다') {
      setLight('receiving a lot of sunlight');
      buttonSetLight(name);
    } else if (name === '적당하다') {
      setLight('get enough sunlight');
      buttonSetLight(name);
    } else {
      setLight('less sunlight');
      buttonSetLight(name);
    }
    setOnLight(true);
  };

  const handleFunctionsButton = (event) => {
    const name = event.target.value;
    if (name === '공기정화') {
      setFunctions('for air purification');
      buttonSetFunctions(name);
    } else if (name === '장식') {
      setFunctions('for decoration');
      buttonSetFunctions(name);
    } else if (name === '둘 다 원해요') {
      setFunctions('for air purication and decoration');
      buttonSetFunctions(name);
    } else {
      setFunctions('');
    }
    setOnFunctions(true);
  };

  console.log('recommend usernum', usernum);
  console.log('recommend button', buttonValue);
  console.log('usernum', state);

  const showModal = (event) => {
    const value = event.target.value;
    const text = value.split(',');
    console.log(text[0]);
    setrecommendPlant(text[0]);
    setPlantContext(text[1]);
    setOpen(true);
  };

  //식물이름 가져오기
  const userMainPlant = async () => {
    axios.post('http://localhost:8800/plantall', { usernum: usernum }).then((res) => {
      setUserPlantNum(res.data[res.data.length - 1].key);
      setPlantName(res.data[res.data.length - 1].plant_name);
      console.log('recommend page', userplantnum, plantname);
    });
  };

  const handleOk = async () => {
    console.log('button', buttonValue);
    axios
      .post('http://localhost:8800/plantenroll', {
        usernum: usernum,
        plantmain: buttonValue,
        plantname: recommendPlant,
        //plantpicture: 'png',    //경로로 바꾸기
        plantcharacteristic: plantContext,
      })
      .then((response) => {
        alert('등록되었습니다');
        console.log(response.data);
        setIsMain(true);
        userMainPlant()
          .then(() => {
            handleTodo();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(false);
  };

  //식물 투두리스트 todo 테이블에 저장
  const handleTodo = () => {
    axios.post('http://localhost:8800/rectodo', { plantname: plantname, userplantnum: userplantnum, usernum: usernum }).then((res) => {
      console.log('todotodotodo', res.data);
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const text = `${experience} ${time} ${address} ${size} ${light} ${functions}`;
  const text2 = `${buttonexperience} ${buttontime} ${buttonaddress} ${buttonsize} ${buttonlight} ${buttonfunctions}`;
  console.log('text: ', text);
  console.log('text2: ', text2);

  const handleSubmit = async (e) => {
    console.log(loading);
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8800/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      // plant recommendations API call
      // const res1 = await axios.post('http://localhost:8800/recommend', { message });
      // setPlantRecommendations(res1.data.message);

      //plant image creation API call
      const res2 = await axios.post('http://localhost:8800/', { message });
      setPlantImages(res2.data.images);

      const result = await response.json().then((data) => setResponse(data.message), setLoading(false));

      // handleSubmit이 완료된 후에 추가 요청 보내기
      await handleInsertText();
    } catch (error) {
      window.alert(error);
    }
  };

  const handleInsertText = async () => {
    try {
      const res3 = await axios.post('http://localhost:8800/inserttext', { message: text2, usernum: state });
      // 추가 요청에 대한 처리 코드
    } catch (error) {
      window.alert(error);
    }
  };

  useEffect(() => {
    userMainPlant();
  }, []);

  return isMain ? (
    <Main />
  ) : onExperience ? (
    onTime ? (
      onAddress ? (
        onSize ? (
          onLight ? (
            onFunctions ? (
              loading ? (
                <>
                  <div className='main_nav_rec'>
                    <div className='main_logo_rec'>
                      <NavLink to={'http://localhost:3000/'}>
                        <img src={logo} alt='My Image' width='160' height='60' />
                      </NavLink>
                    </div>

                    <div className='main_nav_but_rec'>
                      <Link to='/main'> 메인 페이지 </Link>
                      <Link to='/community'> 커뮤니티 </Link>
                      <Link to='/todo'> to-do list </Link>
                      <Link to='/random'> 식물 성향 테스트 </Link>
                      <button onClick={handleSubmit}>로그아웃</button>
                    </div>
                  </div>

                  <div className='resuit'>
                    <form onSubmit={handleSubmit}>
                      <button
                        className='resultbtn'
                        type='submit'
                        value={`${text}`}
                        onClick={() => {
                          setMessage(`${text}`);
                        }}
                      >
                        결과를 보시겠습니까?
                      </button>
                    </form>
                    <br></br>
                    <br></br>
                    <div className='spin'>
                      <Space direction='vertical'>
                        <Spin tip='Loading' size='large'>
                          <div className='content' />
                        </Spin>
                      </Space>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='main_nav_rec'>
                    <div className='main_logo_rec'>
                      <NavLink to={'http://localhost:3000/'}>
                        <img src={logo} alt='My Image' width='160' height='60' />
                      </NavLink>
                    </div>

                    <div className='main_nav_but_rec'>
                      <Link to='/main'> 메인 페이지 </Link>
                      <Link to='/community'> 커뮤니티 </Link>
                      <Link to='/todo'> to-do list </Link>
                      <Link to='/random'> 식물 성향 테스트 </Link>
                      <button onClick={handleSubmit}>로그아웃</button>
                    </div>
                  </div>

                  <div className='result'>
                    <form onSubmit={handleSubmit}>
                      <button
                        className='resultbtn'
                        type='submit'
                        value={`${text}`}
                        onClick={() => {
                          setMessage(`${text}`);
                        }}
                      >
                        결과를 보시겠습니까?
                      </button>
                    </form>
                    <br></br>
                    <br></br>
                    <div>
                      {Array.isArray(response) &&
                        response.map((plant) => (
                          <div className='recommend' key={plant.name}>
                            <button value={[[plant.korName], [plant.plant_characteristic]]} className='recbtn' onClick={showModal}>
                              {plant.korName}
                            </button>
                            <div style={{ justifyContent: 'space-between' }}>
                              <h3>Plant Images:</h3>
                              {plantImages.length > 0 && (
                                <div className='plantimg'>
                                  {plantImages.map((imageUrl, idx) => (
                                    <img key={idx} src={imageUrl} alt={`generated image ${idx}`} />
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className='encan'>
                              <Modal
                                title='식물요정'
                                open={open}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                footer={[
                                  <Button key='enroll' onClick={handleOk}>
                                    등록
                                  </Button>,
                                  <Button key='cancel' onClick={handleCancel}>
                                    취소
                                  </Button>,
                                ]}
                              >
                                <h2 className='enroll'>{recommendPlant} 키우시겠습니까?</h2>
                              </Modal>
                            </div>
                            <br></br>
                            <div>{plant.plant_characteristic}</div>
                            <br></br>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                <div className='main_nav_rec'>
                  <div className='main_logo_rec'>
                    <NavLink to={'http://localhost:3000/'}>
                      <img src={logo} alt='My Image' width='160' height='60' />
                    </NavLink>
                  </div>

                  <div className='main_nav_but_rec'>
                    <Link to='/main'> 메인 페이지 </Link>
                    <Link to='/community'> 커뮤니티 </Link>
                    <Link to='/todo'> to-do list </Link>
                    <Link to='/random'> 식물 성향 테스트 </Link>
                    <button onClick={handleSubmit}>로그아웃</button>
                  </div>
                </div>

                <div className='Functions'>
                  <div className='exx6'>
                    <p> (6/6) </p>
                  </div>
                  <br></br>
                  <p>원하는 식물의 성장속도가 있나요?</p>
                  <br></br>
                  <button className='btn' value='공기정화' onClick={handleFunctionsButton}>
                    빠른 성장
                  </button>
                  <br></br>
                  <br></br>
                  <button className='btn' value='장식' onClick={handleFunctionsButton}>
                    느린 성장
                  </button>
                  <br></br>
                  <br></br>
                  <button className='btn' value='상관없어요' onClick={handleFunctionsButton}>
                    상관없어요
                  </button>{' '}
                </div>
              </>
            )
          ) : (
            <>
              <div className='main_nav_rec'>
                <div className='main_logo_rec'>
                  <NavLink to={'http://localhost:3000/'}>
                    <img src={logo} alt='My Image' width='160' height='60' />
                  </NavLink>
                </div>

                <div className='main_nav_but_rec'>
                  <Link to='/main'> 메인 페이지 </Link>
                  <Link to='/community'> 커뮤니티 </Link>
                  <Link to='/todo'> to-do list </Link>
                  <Link to='/random'> 식물 성향 테스트 </Link>
                  <button onClick={handleSubmit}>로그아웃</button>
                </div>
              </div>

              <div className='Light'>
                <div className='exx5'>
                  <p> (5/6) </p>
                </div>
                <br></br>
                <p>애완동물과 함께 키울 계획이 있으신가요?</p>
                <br></br>
                <button className='btn' value='많다' onClick={handleLightButton}>
                  있다
                </button>
                <br></br>
                <br></br>
                <button className='btn' value='적당하다' onClick={handleLightButton}>
                  없다
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <div className='main_nav_rec'>
              <div className='main_logo_rec'>
                <NavLink to={'http://localhost:3000/'}>
                  <img src={logo} alt='My Image' width='160' height='60' />
                </NavLink>
              </div>

              <div className='main_nav_but_rec'>
                <Link to='/main'> 메인 페이지 </Link>
                <Link to='/community'> 커뮤니티 </Link>
                <Link to='/todo'> to-do list </Link>
                <Link to='/random'> 식물 성향 테스트 </Link>
                <button onClick={handleSubmit}>로그아웃</button>
              </div>
            </div>

            <div className='Size'>
              <div className='exx4'>
                <p> (4/6) </p>
              </div>
              <br></br>
              <p>식물의 장식적 가치에 대해 어떻게 생각하시나요?</p>
              <br></br>
              <button className='btn' value='크다' onClick={handleSizeButton}>
                화려하고 선명한 잎을 가진 식물
              </button>
              <br></br>
              <br></br>
              <button className='btn' value='중간' onClick={handleSizeButton}>
                조화롭고 차분한 분위기를 연출하는 식물
              </button>
              <br></br>
              <br></br>
              <button className='btn' value='작다' onClick={handleSizeButton}>
                장식적 가치를 고려하지 않음
              </button>
            </div>
          </>
        )
      ) : (
        <>
          <div className='main_nav_rec'>
            <div className='main_logo_rec'>
              <NavLink to={'http://localhost:3000/'}>
                <img src={logo} alt='My Image' width='160' height='60' />
              </NavLink>
            </div>

            <div className='main_nav_but_rec'>
              <Link to='/main'> 메인 페이지 </Link>
              <Link to='/community'> 커뮤니티 </Link>
              <Link to='/todo'> to-do list </Link>
              <Link to='/random'> 식물 성향 테스트 </Link>
              <button onClick={handleSubmit}>로그아웃</button>
            </div>
          </div>

          <div className='Address'>
            <div className='exx3'>
              <p> (3/6) </p>
            </div>
            <br></br>
            <p>식물의 향기에 대해 어떤 것을 선호하시나요?</p>
            <br></br>
            <button className='btn' value='yes' onClick={handleAddressButton}>
              꽃의 향기를 선호
            </button>
            <br></br>
            <br></br>
            <button className='btn' value='no' onClick={handleAddressButton}>
              상쾌하고 신선한 향기 선호
            </button>
            <br></br>
            <button className='btn' value='special' onClick={handleAddressButton}>
              특별한 향기를 선호
            </button>
            <br></br>
            <br></br>
            <button className='btn' value='nothing' onClick={handleAddressButton}>
              향기를 선호하지 않음
            </button>
            <br></br>
          </div>
        </>
      )
    ) : (
      <>
        <div className='main_nav_rec'>
          <div className='main_logo_rec'>
            <NavLink to={'http://localhost:3000/'}>
              <img src={logo} alt='My Image' width='160' height='60' />
            </NavLink>
          </div>

          <div className='main_nav_but_rec'>
            <Link to='/main'> 메인 페이지 </Link>
            <Link to='/community'> 커뮤니티 </Link>
            <Link to='/todo'> to-do list </Link>
            <Link to='/random'> 식물 성향 테스트 </Link>
            <button onClick={handleSubmit}>로그아웃</button>
          </div>
        </div>

        <div className='Time'>
          <div className='exx2'>
            <p> (2/6) </p>
          </div>
          <br></br>
          <p>식물의 수명 주기에 대해 어떤 것을 선호하시나요?</p>
          <br></br>
          <button className='btn' value='yes' onClick={handleTimeButton}>
            계절마다 변화하는 식물
          </button>
          <br></br>
          <br></br>
          <button className='btn' value='no' onClick={handleTimeButton}>
            일년내내 비슷한 상태를 유지하는 식물
          </button>
        </div>
      </>
    )
  ) : (
    <>
      <div className='main_nav_rec'>
        <div className='main_logo_rec'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_rec'>
          <Link to='/main'> 메인 페이지 </Link>
          <Link to='/community'> 커뮤니티 </Link>
          <Link to='/todo'> to-do list </Link>
          <Link to='/random'> 식물 성향 테스트 </Link>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className='Experience'>
        <div className='exx'>
          <p> (1/6) </p>
        </div>
        <br></br>
        <p>식물의 수분 요구량에 대해 어떻게 생각하세요?</p>
        <br></br>
        <button className='btn' value='yes' onClick={handleExperienceButton}>
          자주 줄 수 있음
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='no' onClick={handleExperienceButton}>
          드물게 줄 수 있음
        </button>
      </div>
    </>
  );
};

export default App;
