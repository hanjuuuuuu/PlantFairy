import React, { useState, useEffect, useContext } from 'react';
import '../design/todo.css';
import axios from 'axios';
import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
import { Calendar, Col, Radio, Row, Select, Typography, theme } from 'antd';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import logo from '../img/logo.png';
import { AuthContext } from '../context/authContext';

const Todo = () => {
  /**
   *  페이지에서 사용하는 상태변수
   */

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [daynum, setDaynum] = useState(moment(selectedDate).format('DD'));
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const today = ('0' + new Date().getDate()).slice(-2);

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

  const onMain = () => {
    // 페이지로 이동
    navigate('/main', { state: state });
  };

  //main에서 usernum, userplantnum 받아오기
  const { state } = useLocation();
  let plantname;
  let userplantnum;

  //캘린더에서 날짜를 클릭하면 식물이름 가져오기, 날짜 변경
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDaynum(moment(date).format('DD'));

    axios.post('http://localhost:8800/plantall', { usernum: state }).then((res) => {
      userplantnum = res.data[res.data.length - 1].key;
      plantname = res.data[res.data.length - 1].plant_name;
      console.log(userplantnum, plantname);
      console.log('daynum!!!!!!!!', daynum);
      userTodo();
    });
  };

  const userTodo = () => {
    //등록된 식물 투두리스트 (날짜에 맞게) 가져오기
    //값이 와야지만 넘어가게
    axios
      .post('http://localhost:8800/planttodo', {
        plantname: plantname,
        userplantnum: userplantnum,
        day: daynum,
      })
      .then((res) => {
        console.log('daynum', daynum);
        console.log('todotodotodo', res.data);
        setTasks(res.data);
        setIsChecked(res.data[0].complete);
      })
      .catch((error) => console.log(error));
  };

  //투두리스트 체크박스 클릭하면
  const handleCheckboxChange = (taskKey, taskDay, taskComplete) => {
    console.log('handlecheckboxchange', taskKey, taskDay, taskComplete);
    const updatedTasks = tasks.map((task) => (task.key === taskKey ? { ...task, complete: !task.complete } : task));
    setTasks(updatedTasks);

    // 유저 체크 상태 변경
    //   axios.post('http://localhost:8800/updatetaskcomplete', {
    //   todonum: taskKey,
    //   complete: !taskComplete,
    // })
    //   .then((response) => {
    //     console.log('Task complete', response);
    //   });

    //체크됐을 때 유저 포인트 올리기
    if (!taskComplete) {
      setUserPoints(userPoints + 1);
      updateUserPoints(taskKey, !taskComplete);
    } else {
      setUserPoints(userPoints - 1);
      updateUserPoints(taskKey, !taskComplete);
    }
  };

  //유저 포인트 올리기
  const updateUserPoints = () => {
    if (isChecked === true) {
      axios
        .post('http://localhost:8800/updateuserpoints', {
          userplantnum: userplantnum,
          usernum: state,
          userpoints: userPoints,
          usercomplete: isChecked,
        })
        .then((res) => {
          console.log('point up');
          console.log(res.data);
        })
        .catch((error) => {
          console.log('error update points', error);
        });
    }
  };

  //유저 포인트, 레벨
  const userPointsLevel = () => {
    console.log('pointslevel', userPoints);
    axios
      .post('http://localhost:8800/userpointslevel', {
        usernum: state,
      })
      .then((res) => {
        console.log(res.data[0]);
        setUserPoints(res.data[0].user_point);
        setUserLevel(res.data[0].user_level);
      })
      .catch((err) => {
        console.log('error pointslevel', err);
      });
  };

  //할 일 체크 됐으면 파란점, 안됐으면 빨간점으로 표시
  const tileContent = ({ date }) => {
    const day = moment(date).format('DD');
    const todo = tasks.find((task) => task.day === day);
    if (todo) {
      return <div className={`dot ${todo.complete ? 'blue' : 'red'}`} />;
    }
    return null;
  };

  // useEffect(() => {
  //   async function handleDateClick(date) {
  //     const data = await userTodo();
  //     //setTasks(data);
  //   }
  //   handleDateClick();
  // }, []);

  useEffect(() => {
    handleDateClick(selectedDate);
  }, [daynum]);

  useEffect(() => {
    userPointsLevel();
  }, []);

  //daynum 변경되면 userTodo실행
  // useEffect(() => {
  //   userTodo();
  // }, [daynum]);

  const [inputs, setInputs] = useState({
    username: '',
    user_pw: '',
  });

  const [err, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let getUserNum = await login(inputs);
      console.log('user_num: ', getUserNum);
      navigate('/main', { state: getUserNum });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  // return (
  //   <>
  //     <div className='main_nav_todo'>
  //       <div className='main_logo_todo'>
  //         <NavLink to={'http://localhost:3000/'}>
  //           <img src={logo} alt='My Image' width='160' height='60' />
  //         </NavLink>
  //       </div>

  //       <div className='main_nav_but_todo'>
  //         <Link to='/main'> 메인 페이지 </Link>
  //         <button onClick={onCommunity}> 커뮤니티 </button>
  //         <button onClick={onTodo}> 투두리스트 </button>
  //         <button onClick={onRandom}> 식물 성향 테스트 </button>
  //         <button onClick={handleSubmit}>로그아웃</button>
  //       </div>
  //     </div>

  //     <div>
  //       <Calendar onClickDay={handleDateClick} tileContent={tileContent}/>
  //       <div className='text-gray-500 mt-4'>
  //         {moment(selectedDate).format('YYYY년 MM월 DD일')}
  //         <br></br>
  //       </div>
  //       <div>
  //         {tasks &&
  //           tasks.map((task) => (
  //             <div key={task.key}>
  //               <input
  //                 type='checkbox'
  //                 checked={task.complete}
  //                 onChange={() => handleCheckboxChange(task.key, task.day, task.complete)}
  //                 disabled={task.day !== today}
  //               />
  //               <label>{task.task}</label>
  //             </div>
  //           ))}
  //       </div>
  //     </div>
  //   </div>
  //   </>
  // );
};

export default Todo;
