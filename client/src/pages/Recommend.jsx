import { Button, Modal, Space, Spin } from 'antd';
import React, { useState, useEffect, useContext, Component } from 'react';
import axios from 'axios';
import '../design/recommend.css';
import Main from './Main.jsx';
import { AuthContext } from '../context/authContext.js';
import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
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
  const [hasData, setHasData] = useState(false);

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [recommendPlant, setrecommendPlant] = useState('');
  const [plantContext, setPlantContext] = useState('');
  const [plantRecommendations, setPlantRecommendations] = useState([]);
  const [image, setImage] = useState('');
  const [plantImages, setPlantImages] = useState([]);
  const [plantname, setPlantName] = useState('');
  const [userplantnum, setUserPlantNum] = useState('');
  const [showResult, setShowResult] = useState(false);

  const { state } = useLocation();

  const onInfo = () => {
    //마이 페이지로 이동
    setIsInfo(true);
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    setIsCommunity(true);
  };
  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate('/todo', { state: state });
  };

  const onRandom = () => {
    //성향테스트 페이지로 이동
    navigate('/random', { state: state });
  };

  const onMain = () => {
    // 페이지로 이동
    navigate('/main', { state: state });
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
    if (name === '관리에 주기적으로 참여 가능') {
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
    if (name === '식물의 크기가 1m 이상') {
      setSize('over 1m');
      buttonSetSize(name);
    } else if (name === '식물의 크기가 30cm ~ 1m 사이') {
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
    if (name === '광량은 많다') {
      setLight('receiving a lot of sunlight');
      buttonSetLight(name);
    } else if (name === '광량은 적당하다') {
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
    if (name === '공기정화 기능') {
      setFunctions('for air purification');
      buttonSetFunctions(name);
    } else if (name === '장식 기능') {
      setFunctions('for decoration');
      buttonSetFunctions(name);
    } else if (name === '공기정화와 장식 기능') {
      setFunctions('for air purication and decoration');
      buttonSetFunctions(name);
    } else {
      setFunctions('');
    }
    setOnFunctions(true);
  };

  //main에서 버튼 값 받아오기
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
    axios
      .post('http://localhost:8800/plantall', {
        usernum: usernum,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.length == 0) {
          console.log('first login');
        } else {
          setUserPlantNum(res.data[res.data.length - 1].key);
          setPlantName(res.data[res.data.length - 1].plant_name);
          console.log('recommend page', userplantnum, plantname);
        }
      });
  };

  //등록 버튼 눌렀을 때
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
        // userMainPlant()
        //   .then(() => {
        //     handleTodo();
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen(false);
  };

  //식물 투두리스트 todo 테이블에 저장
  // const handleTodo = () => {
  //   axios.post('http://localhost:8800/rectodo', {
  //     plantname: recommendPlant,
  //     userplantnum: Number(userplantnum+1),
  //     usernum: usernum
  //   })
  //   .then((res) => {
  //     console.log('todotodotodo', res.data);
  //   });
  // };

  const handleCancel = () => {
    setOpen(false);
  };

  const text = `${experience} ${time} ${address} ${size} ${light} ${functions}`;
  const text2 = `${buttonexperience} ${buttontime} ${buttonaddress} ${buttonsize} ${buttonlight} ${buttonfunctions}`;
  console.log('text: ', text);
  console.log('text2: ', text2);

  // const handleSubmit = async (e) => {
  //   console.log(loading);
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     setShowResult(true);
  //     const response = await fetch('http://localhost:8800/recommend', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message }),
  //     });

  //     // plant recommendations API call
  //     // const res1 = await axios.post('http://localhost:8800/recommend', { message });
  //     // setPlantRecommendations(res1.data.message);

  //     //plant image creation API call
  //     const res2 = await axios.post('http://localhost:8800/', { message });
  //     setPlantImages(res2.data.images);

  //     const result = await response.json().then((data) => setResponse(data.message), setHasData(true));

  //     // handleSubmit이 완료된 후에 추가 요청 보내기
  //     //await handleInsertText();
  //   } catch (error) {
  //     window.alert(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    console.log(loading);
    e.preventDefault();
    try {
      setLoading(true);
      setShowResult(true);

      // 병렬로 요청 보내기
      const [response, res2] = await Promise.all([
        fetch('http://localhost:8800/recommend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        }),
        axios.post('http://localhost:8800/', { message }),
      ]);

      const result = await response.json();
      setResponse(result.message);
      setHasData(true);

      setPlantImages(res2.data.images);
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

  const [inputs, setInputs] = useState({
    username: '',
    user_pw: '',
  });

  const [err, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      let getUserNum = await login(inputs);
      console.log('user_num: ', getUserNum);
      navigate('/main', { state: getUserNum });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  useEffect(() => {
    userMainPlant();
  }, [userplantnum]);

  return isMain ? (
    <Main />
  ) : onExperience ? (
    onTime ? (
      onAddress ? (
        onSize ? (
          onLight ? (
            onFunctions ? (
              loading ? (
                hasData ? (
                  <>
                    <div className='main_nav_rec'>
                      <div className='main_logo_rec'>
                        <NavLink to={'http://localhost:3000/'}>
                          <img src={logo} alt='My Image' width='160' height='60' />
                        </NavLink>
                      </div>

                      <div className='main_nav_but_rec'>
                        <button onClick={onMain}> 메인페이지 </button>
                        <button onClick={onCommunity}> 커뮤니티 </button>
                        <button onClick={onTodo}> 투두리스트 </button>
                        <button onClick={onRandom}> 식물 성향 테스트 </button>
                        <button onClick={handleSubmit}>로그아웃</button>
                      </div>
                    </div>

                    <div className='result'>
                      <br></br>
                      <br></br>
                    </div>
                    <br></br>
                    <br></br>
                    <div>
                      {Array.isArray(response) &&
                        response.map((plant, idx1) => (
                          <div className='recommend' key={plant.name}>
                            <button key={idx1} value={[[plant.korName], [plant.plant_characteristic]]} className='recbtn' onClick={showModal}>
                              {plant.korName}
                            </button>
                            <br></br>
                            <div style={{ justifyContent: 'space-between' }}>
                              {plantImages.length > 0 && (
                                <div className='plantimg'>
                                  {plantImages.map((imageUrl, idx2) => (
                                    <img key={idx2} src={imageUrl} alt={`generated image ${idx2}`} style={{ display: idx2 === idx1 ? 'block' : 'none' }} />
                                  ))}
                                </div>
                              )}
                            </div>
                            <br></br>
                            <div>{plant.plant_characteristic}</div>
                            <br></br>
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
                            <br></br>
                          </div>
                        ))}
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
                        <button onClick={onMain}> 메인페이지 </button>
                        <button onClick={onCommunity}> 커뮤니티 </button>
                        <button onClick={onTodo}> 투두리스트 </button>
                        <button onClick={onRandom}> 식물 성향 테스트 </button>
                        <button onClick={handleSubmit}>로그아웃</button>
                      </div>
                    </div>

                    <div className='result'>
                      <br></br>
                      <br></br>
                    </div>
                    <h4>30초 정도 기다려주세요</h4>
                    <br></br>
                    <br></br>
                    <div className='spin'>
                      <Space direction='vertical'>
                        <Spin tip='Loading' size='large'>
                          <div className='content' />
                        </Spin>
                      </Space>
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
                      <button onClick={onMain}> 메인페이지 </button>
                      <button onClick={onCommunity}> 커뮤니티 </button>
                      <button onClick={onTodo}> 투두리스트 </button>
                      <button onClick={onRandom}> 식물 성향 테스트 </button>
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
                  </div>
                  <br></br>
                  <br></br>
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
                    <button onClick={onMain}> 메인페이지 </button>
                    <button onClick={onCommunity}> 커뮤니티 </button>
                    <button onClick={onTodo}> 투두리스트 </button>
                    <button onClick={onRandom}> 식물 성향 테스트 </button>
                    <button onClick={handleSubmit}>로그아웃</button>
                  </div>
                </div>

                <div className='Functions'>
                  <div className='exx6'>
                    <p> (6/6) </p>
                  </div>
                  <br></br>
                  <p>원하는 식물의 기능이 있나요?</p>
                  <br></br>
                  <button className='btn' value='공기정화 기능' onClick={handleFunctionsButton}>
                    공기 정화
                  </button>
                  <br></br>
                  <br></br>
                  <button className='btn' value='장식 기능' onClick={handleFunctionsButton}>
                    장식
                  </button>
                  <br></br>
                  <br></br>
                  <button className='btn' value='공기정화와 장식 기능' onClick={handleFunctionsButton}>
                    둘 다 원해요
                  </button>
                  <br></br>
                  <br></br>
                  <button className='btn' value='식물의 기능은 상관없음' onClick={handleFunctionsButton}>
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
                  <button onClick={onMain}> 메인페이지 </button>
                  <button onClick={onCommunity}> 커뮤니티 </button>
                  <button onClick={onTodo}> 투두리스트 </button>
                  <button onClick={onRandom}> 식물 성향 테스트 </button>
                  <button onClick={handleSubmit}>로그아웃</button>
                </div>
              </div>

              <div className='Light'>
                <div className='exx5'>
                  <p> (5/6) </p>
                </div>
                <br></br>
                <p>광량 조건은 어떻게 되나요?</p>
                <br></br>
                <button className='btn' value='광량은 많다' onClick={handleLightButton}>
                  많다
                </button>
                <br></br>
                <br></br>
                <button className='btn' value='광량은 적당하다' onClick={handleLightButton}>
                  적당하다
                </button>
                <br></br>
                <br></br>
                <button className='btn' value='광량은 적다' onClick={handleLightButton}>
                  적다
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
                <button onClick={onMain}> 메인페이지 </button>
                <button onClick={onCommunity}> 커뮤니티 </button>
                <button onClick={onTodo}> 투두리스트 </button>
                <button onClick={onRandom}> 식물 성향 테스트 </button>
                <button onClick={handleSubmit}>로그아웃</button>
              </div>
            </div>

            <div className='Size'>
              <div className='exx4'>
                <p> (4/6) </p>
              </div>
              <br></br>
              <p>원하는 식물의 크기가 있나요?</p>
              <br></br>
              <button className='btn' value='식물의 크기가 1m 이상' onClick={handleSizeButton}>
                크다(1m 이상)
              </button>
              <br></br>
              <br></br>
              <button className='btn' value='식물의 크기가 30cm ~ 1m 사이' onClick={handleSizeButton}>
                중간(30cm ~ 1m)
              </button>
              <br></br>
              <br></br>
              <button className='btn' value='식물의 크기가 30cm 이하' onClick={handleSizeButton}>
                작다(30cm 이하)
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
              <button onClick={onMain}> 메인페이지 </button>
              <button onClick={onCommunity}> 커뮤니티 </button>
              <button onClick={onTodo}> 투두리스트 </button>
              <button onClick={onRandom}> 식물 성향 테스트 </button>
              <button onClick={handleSubmit}>로그아웃</button>
            </div>
          </div>

          <div className='Address'>
            <div className='exx3'>
              <p> (3/6) </p>
            </div>
            <br></br>
            <p>식물을 키우는 장소는 어디인가요?</p>
            <br></br>
            <button className='btn' value='실내' onClick={handleAddressButton}>
              실내
            </button>
            <br></br>
            <br></br>
            <button className='btn' value='실외' onClick={handleAddressButton}>
              실외
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
            <button onClick={onMain}> 메인페이지 </button>
            <button onClick={onCommunity}> 커뮤니티 </button>
            <button onClick={onTodo}> 투두리스트 </button>
            <button onClick={onRandom}> 식물 성향 테스트 </button>
            <button onClick={handleSubmit}>로그아웃</button>
          </div>
        </div>

        <div className='Time'>
          <div className='exx2'>
            <p> (2/6) </p>
          </div>
          <br></br>
          <p>식물 관리에 참여할 수 있는 시간이 얼마나 되나요?</p>
          <br></br>
          <button className='btn' value='관리에 주기적으로 참여 가능' onClick={handleTimeButton}>
            주기적으로 참여 가능
          </button>
          <br></br>
          <br></br>
          <button className='btn' value='체계적인 관리 없이도 자랐으면 좋겠음' onClick={handleTimeButton}>
            체계적인 관리 없이도 자랐으면 좋겠음
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
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className='Experience'>
        <div className='exx'>
          <p> (1/6) </p>
        </div>
        <br></br>
        <p>식물을 키워본 적이 있으신가요?</p>
        <br></br>
        <button className='btn' value='식물을 키워본 경험 없음' onClick={handleExperienceButton}>
          yes
        </button>
        <br></br>
        <br></br>
        <button className='btn' value='식물을 키워본 경험 있음' onClick={handleExperienceButton}>
          no
        </button>
      </div>
    </>
  );
};

export default App;
