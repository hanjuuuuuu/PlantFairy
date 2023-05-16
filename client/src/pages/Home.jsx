import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../design/home.css';
import logo from '../img/logo.png';
import homeimg5 from '../img/homeimg5.png';
import homeimg6 from '../img/homeimg6.png';
import todo from '../img/todo.png';
import com from '../img/com.png';
import point from '../img/point.png';

function Home() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <><><><><><div className='nav'>

      <div className='logo'>
        <img src={logo} alt='My Image' width='160' height='60' />
      </div>

      <div className='nav_but'>
        <Link to='/mypage'> 마이 페이지 </Link>
        <Link to='/main'> 메인 페이지 </Link>
        <Link to='#'> 커뮤니티 </Link>
        <Link to='#'> to-do list </Link>
        <Link to='#'> 식물 성향 테스트 </Link>
        <button type='submit' >
            로그아웃
          </button>
      </div>
    </div>

      <section className='header'>
        <div className='title'>
          <img src={logo} alt='My Image' />
          <h1> 시작하기 </h1>
          <p> 식물요정 웹 사이트에 오신 것을 환영합니다. </p>
          <button type='submit' onClick={navigateToLogin}>
            로그인
          </button>
          &nbsp; &nbsp;
          <button type='submit' onClick={navigateToRegister}>
            회원가입
          </button>
        </div>
      </section></>

      <section className='intro'>
        <div className='card'>
          <i className='feb fa-css3-alt'></i>
          <img src={todo} alt='My Image' width={55} height={65} />
          <h1> to-do list </h1>
          <p> to-do list를 통해 식물을 체계적으로 키울 수 있도록 도와줍니다. </p>
        </div>

        <div className='card'>
          <i className='fas fa-cloud-download-alt'></i>
          <img src={com} alt='My Image' width={55} height={58} />
          <h1> 커뮤니티 </h1>
          <p> 사용자들 간의 소통을 통해 유대감 형성에 기여합니다. </p>
        </div>

        <div className='card'>
          <i className='feb fa-evernote'></i>
          <img src={point} alt='My Image' width={50} height={50} />
          <h1> 포인트 </h1>
          <p> 포인트를 통해 각종 서비스를 지원 받을 수 있습니다. </p>
        </div>
      </section></>

      <section className='service'>
        <div className='container'>
          <div className='img'>
            <img src={homeimg5} alt='My Image' />
          </div>
          <div className='text'>
            <h1> 식물요정 </h1>
            <br></br>
            <p> 작고 귀여운 요정은 사람들에게 도움을 주는 존재로 묘사됩니다. 요정이 항상 우리 곁에서 </p>
            <p> 도움을 준다는 느낌을 주고 싶어서 웹 사이트 이름을 식물요정으로 지었습니다. 식물요정은 </p>
            <p> 사용자에 맞는 식물을 추천해주고, 더욱 체계적으로 관리할 수 있도록 도와줍니다. </p>
          </div>
        </div>
      </section></>

      <section className='service2'>
        <div className='container2'>
          <div className='text2'>
            <h1> 설계목적 </h1>
            <br></br>
            <p> 커뮤니티 기능을 통한 소통을 통해 사용자 간의 유대감 형성에 기여합니다. </p>
            <p> 건강한 환경을 유지하고, 마음의 안정을 가져다 주는데 기여합니다. </p>
            <p> 식물을 키우며 성취감과 자연의 소중함을 느낄 수 있도록 합니다. </p>
            <p> 식물을 키우는 사람들이 더 많아질 수 있도록 합니다. </p>
          </div>
          <div className='img2'>
            <img src={homeimg6} alt='My Image' />
          </div>
        </div>
      </section></>
      
      <footer>
        <div className='container'>
          <div class="left">
            <h1> 식물요정 </h1>
            <p> http://localhost:3000/ </p>
          </div>
          <div className='right'>
            <div className='list'>
              <h2> CONTECT </h2>
              <ul>
                <li> contect #1 </li>
                <li> contect #2 </li>
              </ul>
            </div>
            &nbsp; &nbsp;
            <div className='list'>
              <h2> ABOUT </h2>
              <ul>
                <li> about #1 </li>
                <li> about #2 </li>
              </ul>
            </div>
          </div>
        </div>
      </footer></>

  );
}

export default Home;
