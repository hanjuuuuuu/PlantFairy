import React, { useState, useEffect } from 'react';
import '../design/todo.css';
import axios from 'axios';
import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
import { Calendar, Col, Radio, Row, Select, Typography, theme } from 'antd';
//import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import logo from '../img/logo.png';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const Todo = () => {
  //const { token } = theme.useToken();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [daynum, setDaynum] = useState('');

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

  //usernum 받아오기
  const { state } = useLocation();
  let plantname;
  let userplantnum;
  //let daynum;

  //식물이름 가져오기, 날짜 변경
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

  // const handleDateClick = (date) => {
  //   setSelectedDate(date);
  //   setDaynum(moment(date).format("DD"));
  // }

  const userTodo = () => {
    //등록된 식물 투두리스트 (날짜에 맞게) 가져오기
    //값이 와야지만 넘어가게
    axios.post('http://localhost:8800/planttodo', { plantname: plantname, userplantnum: userplantnum, usernum: state, day: daynum }).then((res) => {
      console.log('daynum', daynum);
      console.log('todotodotodo', res.data);
      setTasks(res.data);
    });
  };

  const handleCheckboxChange = (taskKey) => {
    const updatedTasks = tasks.map((task) => (task.key === taskKey && task.day === daynum ? { ...task, complete: !task.complete } : task));
    setTasks(updatedTasks);
  };

  useEffect(() => {
    async function handleDateClick(date) {
      const data = await userTodo();
      //setTasks(data);
    }
    handleDateClick();
  }, []);

  //daynum 변경되면 userTodo실행
  // useEffect(() => {
  //   userTodo();
  // }, [daynum])

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

  return (
    <>
      <div className='main_nav_todo'>
        <div className='main_logo_todo'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_todo'>
          <Link to='/main'> 메인 페이지 </Link>
          <Link to='/community'> 커뮤니티 </Link>
          <Link to='/todo'> to-do list </Link>
          <Link to='/random'> 식물 성향 테스트 </Link>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div>
        {/* <Calendar onClickDay={handleDateClick()} /> */}
        <div className='text-gray-500 mt-4'>
          {moment(selectedDate).format('YYYY년 MM월 DD일')}
          <br></br>
        </div>
        <div>
          {tasks &&
            tasks.map((task) => (
              <div key={task.key}>
                <input type='checkbox' checked={task.complete} onChange={() => handleCheckboxChange(task.key)} disabled={task.day !== daynum} />
                <label>{task.task}</label>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
