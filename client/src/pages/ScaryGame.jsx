import React, { useState, useEffect } from 'react';
import { Typography, Spin, Space } from 'antd';
import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
import logo from '../img/logo.png';

import '../design/scarygame.css';

const ScaryGame = () => {
  /**
   * 페이지에서 사용하는 상태변수
   */
  const [first, setFirst] = useState(false);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [fourth, setFourth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onExtrovert, setExtrovert] = useState('');
  const [onIntuitive, setIntuitive] = useState('');
  const [onEmotional, setEmotional] = useState('');
  const [onRecognition, setRecognition] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [showResult, setShowResult] = useState(false);

  //**
  /*
    /*  화면에서 사용하는 이벤트를 정의
   */
  const navigate = useNavigate();

  const onInfo = () => {
    //마이 페이지로 이동
    navigate('/info', { state: state });
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate('/community', { state: state });
  };

  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate('/todo', { state: state });
  };

  const onRandom = () => {
    // 페이지로 이동
    navigate('/random', { state: state });
  };

  const onMain = () => {
    // 페이지로 이동
    navigate('/main', { state: state });
  };

  //usernum 받아오기
  const { state } = useLocation();
  console.log('usernum', state);

  const handleFirstButton = (event) => {
    const name = event.target.value;
    console.log(name);
    if (name === 'e') setExtrovert('e');
    else setExtrovert('i');
    setFirst(true);
  };

  const handleSecondButton = (event) => {
    const name = event.target.value;
    console.log(name);
    if (name === 's') setIntuitive('s');
    else setIntuitive('n');
    setSecond(true);
  };

  const handleThirdButton = (event) => {
    const name = event.target.value;
    console.log(name);
    if (name === 't') setEmotional('t');
    else setEmotional('f');
    setThird(true);
  };

  const handleFourthButton = (event) => {
    const name = event.target.value;
    console.log(name);
    if (name === 'j') setRecognition('j');
    else setRecognition('p');
    setFourth(true);
  };

  const text = `${onExtrovert}${onIntuitive}${onEmotional}${onRecognition}`;
  console.log('text: ', text);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setShowResult(true);
      const response = await fetch('http://localhost:8800/plantgame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const result = await response.json().then((data) => setResponse(data.message), setLoading(false));
    } catch (error) {
      window.alert(error);
    }
  };

  return loading ? (
    <div>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
      <br></br>
      <br></br>
      <div className='scary_spin'>
        <div className='spin'>
          <Space direction='vertical'>
            <Spin tip='Loading' size='large'>
              <div className='content' />
            </Spin>
          </Space>
        </div>
      </div>
    </div>
  ) : //결과
  fourth ? (
    <div>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
      <form onSubmit={handleSubmit}>
        <button
          className={`resultbtn ${showResult || response.length > 0 ? 'hidden' : ''}`}
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
      {Array.isArray(response) &&
        response.map((plant) => (
          <div>
            <div className='recommend'>{plant.context}</div>
            <br></br>
          </div>
        ))}
    </div>
  ) : //질문4
  third ? (
    <div>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
      <div className='question4'>
        <h1> 4. 당신은 어둠 속에서 무언가 미지의 존재를 느꼈습니다. </h1>
        <h2> 이때, 당신은 어떤 반응을 보일까요?</h2>

        <button className='btn1' value='j' onClick={handleFourthButton}>
          신속하게 도망치려고 합니다.
        </button>

        <button className='btn2' value='p' onClick={handleFourthButton}>
          대화를 시도하여 누군가 있는지 확인합니다.
        </button>

        <button className='btn2' value='p' onClick={handleFourthButton}>
          조용히 서 있거나 숨어서 기다립니다.
        </button>

        <button className='btn2' value='j' onClick={handleFourthButton}>
          침착하게 상황을 분석하고 대처 방법을 찾습니다.
        </button>
      </div>
    </div>
  ) : //질문3
  second ? (
    <div>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
      <div className='question3'>
        <h1>3. 당신은 어둠 속에서 갑자기 무언가 끊임없이 다가오는 기분을 느낍니다.</h1>
        <h2> 이때, 당신은 어떤 반응을 보일까요? </h2>

        <button className='btn1' value='f' onClick={handleThirdButton}>
          공포와 불안으로 심장이 뛰게 되고 도망치려고 합니다.
        </button>

        <button className='btn2' value='t' onClick={handleThirdButton}>
          호기심에 이끌려 상황을 조사하고 대처 방법을 찾습니다.
        </button>

        <button className='btn2' value='f' onClick={handleThirdButton}>
          혼란스러워하며 숨어서 기다리거나 도움을 요청합니다.
        </button>

        <button className='btn2' value='t' onClick={handleThirdButton}>
          감정을 내부에 억누르고 침착하게 상황을 분석하고 대응합니다.
        </button>
      </div>
    </div>
  ) : //질문2
  first ? (
    <div>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className='question2'>
        {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
        <h1>2. 어느 밤, 어둠 속에서 눈 앞에 무언가 나타납니다. 당신은 그것이 무엇인지를 알고자 합니다.</h1>
        <h2> 이때, 당신은 어떻게 대처할 것인가요? </h2>

        <button className='btn1' value='s' onClick={handleSecondButton}>
          손을 내밀어 물체의 형태와 질감을 직접 확인하려 합니다.
        </button>

        <button className='btn2' value='n' onClick={handleSecondButton}>
          직감에 따라서 당신을 둘러싼 분위기와 감정을 느껴보려 합니다.
        </button>

        <button className='btn2' value='s' onClick={handleSecondButton}>
          눈을 감고 소리, 냄새, 온도 등으로 물체의 특징을 파악하려 합니다.
        </button>

        <button className='btn2' value='n' onClick={handleSecondButton}>
          직관적인 느낌과 판단을 모두 고려하여 당신 앞에 나타난 물체를 알고자 노력합니다.
        </button>
      </div>
    </div>
  ) : (
    //질문1
    <>
      <div className='main_nav_scary'>
        <div className='main_logo_scary'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_scary'>
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>
      <div className='question1'>
        {/* <Typography.Title className='title' level={4}>식물 추천</Typography.Title> */}
        <h1>1. 어느 날 당신은 홀로 집에 있는데, 어딘가에서 문이 살짝 열리는 소리가 들립니다.</h1>
        <h2> 당신은 어떻게 대처하시겠습니까? </h2>

        <button className='btn1' value='e' onClick={handleFirstButton}>
          호기심에 이끌려서 그 소리가 나는 곳을 확인해본다.
        </button>

        <button className='btn2' value='i' onClick={handleFirstButton}>
          무서워서 그 자리에 굳어서 움직일 수 없다.
        </button>

        <button className='btn2' value='e' onClick={handleFirstButton}>
          빠르게 도망쳐서 안전한 곳으로 피한다.
        </button>

        <button className='btn2' value='i' onClick={handleFirstButton}>
          그냥 집 안에 있으며 무시하고 계속 편안하게 시간을 보낸다.
        </button>
      </div>
    </>
  );
};

export default ScaryGame;
