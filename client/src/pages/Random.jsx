import React, { useEffect, useState, useContext } from "react";
import "../design/random.css";
import axios from "axios";
import { Typography, Button, Radio } from "antd";
import { useNavigate, useLocation, NavLink, Link } from "react-router-dom";
import FunGame from "./FunGame";
import ScaryGame from "./ScaryGame";
import logo from "../img/logo.png";
import { AuthContext } from "../context/authContext";

const Random = () => {
  /**
   * 페이지에서 사용하는 상태변수
   */
  const [fun, setFun] = useState(false);
  const [scary, setScary] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  //**
  /*
    /*  화면에서 사용하는 이벤트를 정의
   */
  const navigate = useNavigate();

  const onInfo = () => {
    //마이 페이지로 이동
    navigate("/info", { state: state });
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate("/community", { state: state });
  };
  const onTodo = () => {
    //투두리스트 페이지로 이동
    navigate("/todo");
  };
  const onMain = () => {
    //메인 페이지로 이동
    navigate("/main", { state: state });
  };
  const onRandom = () => {
    //성향테스트 페이지로 이동
    try {
      navigate("/random", {
        state: {
          state: state,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/logout");
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  //main에서 usernum, points, level 받아오기
  const location = useLocation();
  const { state, userpoints, userlevel } = location.state;
  console.log("from main", state, userpoints, userlevel);

  const resetPoints = () => {
    setUserLevel(userlevel);
    setUserPoints(userpoints);
  };

  const userFunGame = () => {
    setUserLevel(userlevel);
    setUserPoints(userpoints);
    if (userPoints < 10) {
      alert("포인트가 부족합니다!");
    } else {
      const updatedPoints = userPoints - 10;
      setUserPoints(updatedPoints);
      updateUserPoints(updatedPoints);
      console.log("here", userPoints);
      setFun(true);
    }
  };

  const userScaryGame = () => {
    setUserLevel(userlevel);
    setUserPoints(userpoints);
    if (userPoints < 10) {
      alert("포인트가 부족합니다!");
    } else {
      const updatedPoints = userPoints - 10;
      setUserPoints(updatedPoints);
      updateUserPoints(updatedPoints);
      console.log("here", userPoints);
      setScary(true);
    }
  };

  const [inputs, setInputs] = useState({
    username: "",
    user_pw: "",
  });

  const [err, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogoutSubmit = async (e) => {
    e.preventDefault();
    try {
      let getUserNum = await login(inputs);
      console.log("user_num: ", getUserNum);
      navigate("/main", { state: getUserNum });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  //유저 10포인트 차감
  const updateUserPoints = (points) => {
    axios
      .post("http://localhost:8800/updateuserpoints", {
        usernum: state,
        userpoints: points,
      })
      .then((res) => {
        console.log("-10points");
        console.log(res.data);
      })
      .catch((error) => {
        console.log("error update points", error);
      });
  };

  useEffect(() => {
    resetPoints();
  }, []);

  // return scary ? (
  //   <ScaryGame />
  // ) : fun ? (
  //   <FunGame />
  // ) : (
  //   <>
  //     <div className='main_nav_random'>
  //       <div className='main_logo_random'>
  //         <NavLink to={'http://localhost:3000/'}>
  //           <img src={logo} alt='My Image' width='160' height='60' />
  //         </NavLink>
  //       </div>

  //       <div className='main_nav_but_random'>
  //         <button onclick={onMain}> 메인 페이지 </button>
  //         <button onClick={onCommunity}> 커뮤니티 </button>
  //         <button onClick={onTodo}> 투두리스트 </button>
  //         <button onClick={onRandom}> 식물 성향 테스트 </button>
  //         <button onClick={handleSubmit}>로그아웃</button>
  //       </div>
  //     </div>

  //     <>
  //       {' '}
  //       <section className='random_anim'>
  //         <div class='box_ani'>
  //           <div class='wave -one'></div>
  //           <div class='wave -two'></div>
  //           <div class='wave -three'></div>

  //           <div className='random-ani'>
  //             <h1>
  //               <span>식</span>
  //               <span>물</span>
  //               <span>성</span>
  //               <span>향</span>
  //               <span>테</span>
  //               <span>스</span>
  //               <span>트</span>
  //             </h1>
  //           </div>

  //           <div class='title_ani'>
  //             <Typography.Title className='title' level={4}>
  //               {' '}
  //               성향에 맞는 식물을 추천해 드립니다 !{' '}
  //             </Typography.Title>
  //             <h1 className='theme'>원하는 질문 테마를 선택해주세요.</h1>
  //             <br></br>
  //             <h4 className='theme'>테스트를 이용하시면 10포인트가 차감됩니다.</h4>
  //           </div>
  //         </div>
  //       </section>{' '}
  //       <div className='btn'>
  //         <Button className='choose' onClick={userScaryGame}>
  //           {' '}
  //           공포{' '}
  //         </Button>
  //         <br></br>
  //         <Button className='choose1' onClick={userFunGame}>
  //           {' '}
  //           재미{' '}
  //         </Button>
  //       </div>
  //     </>
  //   </>
  // );

  return scary ? (
    <ScaryGame />
  ) : fun ? (
    <FunGame />
  ) : (
    <>
      <div className="main_nav_random">
        <div className="main_logo_random">
          <NavLink to={"http://localhost:3000/"}>
            <img src={logo} alt="My Image" width="160" height="60" />
          </NavLink>
        </div>

        <div className="main_nav_but_random">
          {/* 메인 onClick 수정해야함 */}
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <>
        {" "}
        <section className="random_anim">
          <div class="box_ani">
            <div class="wave -one"></div>
            <div class="wave -two"></div>
            <div class="wave -three"></div>

            <div className="random-ani">
              <h1>
                <span>식</span>
                <span>물</span>
                <span>성</span>
                <span>향</span>
                <span>테</span>
                <span>스</span>
                <span>트</span>
              </h1>
            </div>

            <div class="title_ani">
              <Typography.Title className="title" level={4}>
                {" "}
                성향에 맞는 식물을 추천해 드립니다 !{" "}
              </Typography.Title>
              <h1 className="theme">원하는 질문 테마를 선택해주세요.</h1>
            </div>

            <div>
              <Button className="choose" onClick={userScaryGame}>
                {" "}
                공포{" "}
              </Button>
              <br></br>
              <Button className="choose1" onClick={userFunGame}>
                {" "}
                재미{" "}
              </Button>
            </div>
          </div>
        </section>{" "}
      </>

      {/*
      <canvas id="c1"></canvas>
      <canvas id="c2"></canvas>
  */}

      <div className="ran">
        {/* <Typography.Title className='title' level={4}> 성향에 맞는 식물을 추천해 드립니다 ! </Typography.Title>
              <h1 className='theme'>원하는 질문 테마를 선택해주세요.</h1> 
              <div>
                  <Button className='choose' onClick={userScaryGame}> 공포 </Button>
                  <br></br>
                  <Button className='choose1' onClick={userFunGame}> 재미 </Button>
              </div> */}
      </div>
    </>
  );
};

export default Random;
