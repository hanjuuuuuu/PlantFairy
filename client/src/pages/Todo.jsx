import React, { useState, useEffect } from 'react';
import '../design/todo.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Checkbox } from 'antd';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

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

  //main에서 usernum, userplantnum 받아오기
  const { state } = useLocation();
  //console.log('todo state', state, 'userplantnum');
  let plantname;
  let userplantnum;
  //let daynum;
  

  //캘린더에서 날짜를 클릭하면 식물이름 가져오기, 날짜 변경
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDaynum(moment(date).format('DD'));

    axios.post('http://localhost:8800/plantall', { usernum: state })
    .then((res) => {
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
    axios.post('http://localhost:8800/planttodo', { 
      plantname: plantname, 
      userplantnum: userplantnum, 
      day: daynum })
      .then((res) => {
        console.log('daynum', daynum);
        console.log('todotodotodo', res.data);
        setTasks(res.data);
      })
      .catch((error) => console.log(error));
  };

  //투두리스트 체크박스 클릭하면
  const handleCheckboxChange = (taskKey,taskDay,taskComplete) => {
    console.log('handlecheckboxchange', taskKey,taskDay,taskComplete);
    // const updatedTasks = tasks.map((task) => 
    //   task.key === taskKey
    //   ? { ...task, checked: !task.complete } 
    //   : task
    // );
    // setTasks(updatedTasks);
    setIsChecked(!isChecked);
    if(taskDay === today) {
      //유저 포인트 업데이트 요청
      setUserPoints(userPoints+1);
      console.log('points', userPoints);
      updateUserPoints();
      //DB에 체크 상태 업데이트 요청
    }
  };

  //유저 포인트 올리기
  const updateUserPoints = () => {
    axios.post('http://localhost:8800/updateuserpoints', {
      userplantnum: userplantnum,
      usernum: state,
      userpoints: userPoints
    })
    .then((res) => {
      console.log('point up');
      console.log(res.data);
    })
    .catch((error) => {
      console.log('error update points', error);
    })
  }

  //유저 포인트, 레벨
  const userPointsLevel = () => {
    console.log('pointslevel', userPoints);
    axios.post('http://localhost:8800/userpointslevel',{
      usernum: state
    })
    .then((res)=> {
      console.log(res.data[0]);
      setUserPoints(res.data[0].user_point);
      setUserLevel(res.data[0].user_level);
    })
    .catch((err) => {
      console.log('error pointslevel', err);
    })
  }

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
  },[]);

  //daynum 변경되면 userTodo실행
  // useEffect(() => {
  //   userTodo();
  // }, [daynum]);

  return (
    <div>
      <Typography.Title className='title' level={4}>
        투두 리스트
      </Typography.Title>
      <menu className='btnmenu'>
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
      </menu>

      <div>
        <Calendar onClickDay={handleDateClick} />
        <div className='text-gray-500 mt-4'>
          {moment(selectedDate).format('YYYY년 MM월 DD일')}
          <br></br>
        </div>
        <div>
          {tasks &&
            tasks.map((task) => (
              <div key={task.key}>
                <input 
                  type='checkbox' 
                  checked={isChecked} 
                  onChange={() => handleCheckboxChange(task.key, task.day, task.complete)} 
                  disabled={task.day !== today} 
                />
                <label>{task.task}</label>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;