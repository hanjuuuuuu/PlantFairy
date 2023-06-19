import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Space, Spin } from 'antd';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js';
import Main from './Main.jsx';
import StarRating from '../components/StarRating.jsx';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import logo from '../img/logo.png';
import '../design/newRecommend.css';

const NewReccomend = ({ usernum, buttonValue }) => {
  const { currentUser } = useContext(AuthContext);

  const [experience, setExperience] = useState('');
  const [onExperience, setOnExperience] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const [isyes, setIsYes] = useState(false);
  const [isno, setIsNo] = useState(false);
  const [issimilar, setIsSimilar] = useState(false);
  const [isdifferent, setIsDifferent] = useState(false);
  const [plantName, setPlantName] = useState(null);
  const [userPick, setUserPick] = useState(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState('');
  const [recommendPlant, setrecommendPlant] = useState('');
  const [plantContext, setPlantContext] = useState('');
  const [plantImages, setPlantImages] = useState([]);
  const [message, setMessage] = useState('');

  const [showNewRec, setShowNewRec] = useState(false);

  const { state, userplantnum } = useLocation();

  // 별점이 안눌렸다면 다음 페이지로 넘어갈 수 없어야 함..

  const [checkedItems, setCheckedItems] = useState([]);

  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate('/community', { state: state });
  };

  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate('/todo', { state: state, userplantnum: userplantnum });
  };

  const onRandom = () => {
    // 페이지로 이동
    navigate('/random', { state: state });
  };

  const onNewRecommend = () => {
    navigate('/newRecommend', { state: state });
  };

  const onMain = () => {
    // 페이지로 이동
    navigate('/main', { state: state });
  };

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
    axios
      .post('http://localhost:8800/getbeforplant', { usernum: currentUser.user_num })
      .then((response) => {
        const plant_name = response.data[0].plant_name;
        console.log('Plantname : ', plant_name);
        setPlantName(plant_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUserPlantPickPrint = () => {
    axios
      .post('http://localhost:8800/getbeforepick', { usernum: currentUser.user_num })
      .then((response) => {
        const user_pick = response.data[0].user_pick;
        setUserPick(user_pick);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleExperienceButton = (e) => {
    const value = e.target.value;
    if (value === 'yes') {
      setExperience(`${plantName} experienced person`);
      setIsYes(true);
      setIsNo(false);
      setLoading(true);
    } else if (value === 'no') {
      setExperience('beginner');
      setIsYes(false);
      setIsNo(true);
    }
    setOnExperience(true);
  };

  const handleButton = (e) => {
    const value = e.target.value;
    if (value === 'similar') {
      setIsSimilar(true);
      setIsDifferent(false);
    } else if (value === 'different') {
      setIsSimilar(false);
      setIsDifferent(true);
    }
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const handleSubmitButton = async (e) => {
    setLoading(false);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/unsatisfied', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reasons: checkedItems, plantName }),
      });

      // const res2 = await axios.post('http://localhost:8800/', { message });
      // setPlantImages(res2.data.images);

      const result = await response.json().then((data) => setResponse(data.message));

      //setLoading(false);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleSimilarButton = async (e) => {
    e.preventDefault();
    try {
      setLoading(false);
      const response = await fetch('http://localhost:8800/similar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plantName }),
      });

      //plant image creation API call
      // const res2 = await axios.post('http://localhost:8800/', { message });
      // setPlantImages(res2.data.images);

      const result = await response.json().then((data) => setResponse(data.message));
    } catch (error) {
      window.alert(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (event) => {
    const value = event.target.value;
    const text = value.split(',');
    console.log(text[0]);
    setrecommendPlant(text[0]);
    setPlantContext(text[1]);
    setOpen(true);
  };

  const text = '';

  const handleOk = async () => {
    //console.log('button', buttonValue);

    axios
      .post('http://localhost:8800/plantenroll', {
        usernum: usernum,
        plantmain: buttonValue,
        plantname: recommendPlant,
        //plantpicture: imagePath,
        plantcharacteristic: plantContext,
      })
      .then((response) => {
        alert('등록되었습니다');
        console.log('response.data in RECCOMEND: ', response.data);
        setIsMain(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
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
    onUserPlantPrint();
    onUserPlantPickPrint();
  }, []);

  if (isMain) {
    return <Main />;
  } else {
    if (isno) {
      if (loading) {
        return (
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
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmitButton}>
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
                    <div className='recommend' key={plant.korName}>
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
                      <div>{plant.plant_characteristic}</div>
                      <br></br>
                    </div>
                  ))}
              </div>
            </div>
          </>
        );
      } else {
        return (
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
                <button onClick={handleLogout}>로그아웃</button>
              </div>
            </div>

            <div className='Address'>
              <div className='exx3'>
                <p> (3/6) </p>
              </div>
              <br></br>
              <p>{plantName}가 별로였던 점을 말해주시면 새로 추천해드릴게요</p>
              <br></br>
              <label>
                <input type='checkbox' value='가격' checked={checkedItems.includes('가격')} onChange={handleCheckboxChange} />
                가격
              </label>
              <label>
                <input type='checkbox' value='관리의 어려움' checked={checkedItems.includes('관리의 어려움')} onChange={handleCheckboxChange} />
                관리의 어려움
              </label>
              <label>
                <input type='checkbox' value='알레르기 반응' checked={checkedItems.includes('알레르기 반응')} onChange={handleCheckboxChange} />
                알레르기 반응
              </label>
              <div>
                <button className='btn' value='different' onClick={handleSubmitButton}>
                  제출
                </button>
              </div>
            </div>
          </>
        );
      }
    } else if (isyes) {
      return (
        <>
          {loading && (
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
                  <button onClick={handleLogout}>로그아웃</button>
                </div>
              </div>

              <div className='Time'>
                <div className='exx2'>
                  <p> (2/2) </p>
                </div>
                <br></br>
                <p>
                  {userPick}의 {plantName}와 비슷한 식물을 추천받으시겠어요? 아니면 새로 추천을 받으시겠어요?
                </p>
                <p>(새로운 추천은 기존에 했던 선택에 추가로 구체적인 질문을 묻습니다!)</p>
                <br></br>
                <div>
                  <button className='btn' value={`${plantName}와/과 비슷한`} onClick={handleSimilarButton}>
                    비슷한
                  </button>
                </div>
                <br />
                <div>
                  <button className='btn' value='different' onClick={onNewRecommend}>
                    새 추천
                  </button>
                </div>
              </div>
            </>
          )}

          {Array.isArray(response) && (
            <div>
              {response.map((plant) => (
                <div className='recommend' key={plant.korName}>
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
                  <br />
                  <div>{plant.plant_characteristic}</div>
                  <br />
                </div>
              ))}
            </div>
          )}
        </>
      );
    } else {
      return (
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
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          </div>

          <div className='Experience'>
            <div className='exx'>
              <p> (1/2) </p>
            </div>
            <br></br>
            <div>
              {plantName && <p>{plantName}에 대한 추천이 마음에 들었나요?</p>}
              <div>
                <br></br>
                <div>
                  <button className='btn' value='yes' onClick={handleExperienceButton}>
                    yes
                  </button>
                </div>
                <br />
                <div>
                  <button className='btn' value='no' onClick={handleExperienceButton}>
                    no
                  </button>
                </div>

                <div>
                  <StarRating />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
};

export default NewReccomend;
