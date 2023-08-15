import React, { useState, useEffect } from 'react';
import '../design/todo.css';
import axios from 'axios';
import logo from '../img/logo.png';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Typography, Checkbox, Space, Spin } from 'antd';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

const Todo = () => {
  /**
   *  페이지에서 사용하는 상태변수
   */
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [todaytasks, setTodayTasks] = useState(tasks);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const today = ('0' + new Date().getDate()).slice(-2);
  const todayday = new Date().getDate();
  const todaymonth = new Date().getMonth() + 1;
  const todayfiltermonth = ('0' + (1 + new Date().getMonth())).slice(-2);
  const todayyear = new Date().getFullYear();
  const [plantname, setPlantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isMain, setIsMain] = useState(false);

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
    //성향테스트 페이지로 이동
    try {
      navigate('/random', {
        state: {
          state: state,
          userpoints: userPoints,
          userlevel: userLevel,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onMain = () => {
    //메인 페이지로 이동
    // navigate('/main', { state: state });
    setIsMain(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/auth/logout');
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  //main에서 usernum, userplantnum 받아오기
  const location = useLocation();
  const { state, userplantnum, userplantname1 } = location.state;
  console.log('from main', state, userplantnum, userplantname1);

  //캘린더에서 날짜를 클릭하면 날짜 변경, 투두 가져오기
  const handleDateClick = (date) => {
    setSelectedDate(moment(date).format('YYYYMMDD'));
    console.log(selectedDate);
    userTodo();
  };

  const createTodo = () => {
    //투두리스트 생성하기
    //식물 투두리스트 todo 테이블에 저장
    setLoading(true);
    setPlantName(userplantname1);
    let engtodaymonth;
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    engtodaymonth = monthNames[todaymonth - 1];
    console.log('month', engtodaymonth);
    console.log(userplantnum, userplantname1);

    try {
      axios
        .post('http://localhost:8800/rectodo', {
          plantname: userplantname1,
          userplantnum: userplantnum,
          usernum: state,
          engtodaymonth: engtodaymonth,
        })
        .then((res) => {
          setLoading(false);
          console.log('todotodotodo', res.data);
          userTodo();
        });
    } catch (err) {
      console.log(err);
    }
  };

  const userTodo = () => {
    //등록된 식물 투두리스트 (날짜에 맞게) 가져오기
    //값이 와야지만 넘어가게
    axios
      .post('http://localhost:8800/planttodo', {
        plantname: userplantname1, //plantname
        userplantnum: userplantnum,
        day: moment(selectedDate).format('YYYYMMDD'),
      })
      .then((res) => {
        console.log('todotodotodo', res.data);
        console.log('hey', res.data[today]);
        setTasks(res.data);
        setTodayTasks(res.data[today]);
        setHasData(res.data.length > 0);
        setIsChecked(res.data[0].complete);
      })
      .catch((error) => console.log(error));
  };

  //투두리스트 체크박스 클릭하면
  const handleCheckboxChange = (taskKey, taskComplete) => {
    console.log('handlecheckboxchange', taskKey, taskComplete);
    const updatedTasks = tasks.map((task) => (task.key === taskKey ? { ...task, complete: 'false' } : task));
    setTasks(updatedTasks);
    setIsChecked(taskComplete);
    updateUserPoints(taskKey, !taskComplete);

    //유저 체크 상태 변경
    axios
      .post('http://localhost:8800/updatetaskcomplete', {
        todonum: taskKey,
        complete: !taskComplete,
      })
      .then((response) => {
        console.log('Task complete', response);
      });

    //체크됐을 때 유저 포인트 올리기 2.
    if (!taskComplete) {
      setUserPoints(userPoints + 1);
      updateUserPoints(taskKey, !taskComplete);
    } else {
      setUserPoints(userPoints - 1);
      updateUserPoints(taskKey, !taskComplete);
    }
  };

  //유저 포인트 변경
  const updateUserPoints = (taskKey, taskComplete) => {
    if (taskComplete) {
      setUserPoints(userPoints + 1);
    } else {
      setUserPoints(userPoints - 1);
    }
    axios
      .post('http://localhost:8800/updatetaskcomplete', {
        todonum: taskKey,
        complete: !taskComplete,
      })
      .then((response) => {
        console.log('UpdateUserPoints');
      });

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
  const tileContent = ({ date, view }) => {
    const todo = tasks.find((task) => task.complete === 'false');
    if (todo) {
      var dotColor = 'dotblue';
      console.log('1', tasks.complete);
    } else dotColor = 'dotred';
    return <div className={`${dotColor}`} />;
  };

  useEffect(() => {
    //handleDateClick(selectedDate);
    userPointsLevel();
    //userTodo();
  }, [userPoints]);

  useEffect(() => {
    userTodo();
  }, [selectedDate]);

  return loading ? (
    //todo 리스트 로딩중인 경우
    <>
      <div className='main_nav'>
        <div className='main_logo'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but'>
          <button onclick={onMain}> 메인 페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div>
        {/* <Typography.Title className='title' level={4}>
        투두 리스트
      </Typography.Title> */}
        {/* <menu className='btnmenu'>
        <button className='menubtn' onClick={onInfo}>
          마이페이지
        </button>
        <br></br>
        <button className='menubtn' onClick={onCommunity}>
          커뮤니티
        </button>
        <br></br>
        <button className='menubtn' onClick={onTodo}>
          To-do list
        </button>
        <br></br>
        <button className='menubtn'>로그아웃</button>
      </menu> */}

        <div>
          <Calendar onClickDay={handleDateClick} />
          <div className='text-gray-500 mt-4'>
            {moment(selectedDate).format('YYYY년 MM월 DD일')}
            <br></br>
          </div>
          <div>
            <button onClick={createTodo} disabled>
              {todaymonth}월의 to-do list를 만드시겠습니까?
            </button>
          </div>
          <br></br>
          <h4>1분정도 소요됩니다!</h4>
          <div className='spin'>
            <Space direction='vertical'>
              <Spin tip='Loading' size='large'>
                <div className='content' />
              </Spin>
            </Space>
          </div>
        </div>
      </div>
    </>
  ) : hasData ? (
    //저장된 투두리스트가 있을 경우
    <>
      <div className='main_nav'>
        <div className='main_logo'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but'>
          <button onclick={onMain}> 메인 페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>
      <div>
        {/* <Typography.Title className='title' level={4}>
    투두 리스트
  </Typography.Title> */}
        {/* <menu className='btnmenu'>
    <button className='menubtn' onClick={onInfo}>
      마이페이지
    </button>
    <br></br>
    <button className='menubtn' onClick={onCommunity}>
      커뮤니티
    </button>
    <br></br>
    <button className='menubtn' onClick={onTodo}>
      To-do list
    </button>
    <br></br>
    <button className='menubtn'>로그아웃</button>
  </menu> */}

        <div>
          <Calendar
            onClickDay={handleDateClick}
            tileContent={({ date, view }) => {
              const isComplete = tasks.some((task) => task.day === moment(date).format('YYYYMMDD') && task.complete === 'false');
              return (
                <div>
                  <div className={isComplete ? 'dotblue' : 'dotred'} />
                </div>
              );
            }}
          />
          <div className='text-gray-500 mt-4'>
            {moment(selectedDate).format('YYYY년 MM월 DD일')}
            <br></br>
          </div>
          <div>
            {tasks &&
              tasks.map((task) => (
                <div key={task.key}>
                  <Checkbox checked={task.complete} onChange={() => handleCheckboxChange(task.key, task.complete)} disabled={task.day !== todayyear + todayfiltermonth + today}>
                    {task.task}
                  </Checkbox>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    //저장된 투두리스트가 없는 경우
    <>
      <div className='main_nav'>
        <div className='main_logo'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but'>
          <button onclick={onMain}> 메인 페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div>
        {/* <Typography.Title className='title' level={4}>
        투두 리스트
      </Typography.Title> */}
        {/* <menu className='btnmenu'>
        <button className='menubtn' onClick={onInfo}>
          마이페이지
        </button>
        <br></br>
        <button className='menubtn' onClick={onCommunity}>
          커뮤니티
        </button>
        <br></br>
        <button className='menubtn' onClick={onTodo}>
          To-do list
        </button>
        <br></br>
        <button className='menubtn'>로그아웃</button>
      </menu> */}

        <div>
          <Calendar onClickDay={handleDateClick} />
          <div className='text-gray-500 mt-4'>
            {moment(selectedDate).format('YYYY년 MM월 DD일')}
            <br></br>
          </div>
          <div>
            <button onClick={createTodo}>{todaymonth}월의 to-do list를 만드시겠습니까?</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
