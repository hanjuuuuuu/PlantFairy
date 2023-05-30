import React, { useState, useEffect } from 'react';
import '../design/todo.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Checkbox} from 'antd';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css'; 
import moment from 'moment';

const Todo = () => {
    //const { token } = theme.useToken();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [task, setTask] = useState('');

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
    }

    //usernum 받아오기
    const { state } = useLocation();
    let plantname;
    let userplantnum;
    let usernum;
    let daynum;
    let dayname;

    //식물이름 가져오기, 날짜 변경
    const handleDateClick = (date) => { 
      setSelectedDate(date);    
      daynum = moment(date).format("DD");

      axios.post("http://localhost:8800/plantall",
      {usernum: state})
      .then((res) => {
        userplantnum = res.data[(res.data.length-1)].key;
        plantname = res.data[(res.data.length-1)].plant_name;
        console.log(userplantnum, plantname);
        console.log('daynum!!!!!!!!',daynum)
        // if(daynum == 1){
        //   console.log('월요일');
        //   dayname = '월요일';
        // }
        // else if(daynum == 2){
        //   console.log('화요일');
        //   dayname = '화요일';
        // }
        // else if(daynum == 3){
        //   dayname ='수요일';
        // }
        // else if(daynum == 4){
        //   dayname ='목요일';
        // }
        // else if(daynum == 5){
        //   dayname ='금요일';
        // }
        // else if(daynum == 6){
        //   dayname ='토요일';
        // }
        // else if(daynum == 7){
        //   dayname ='일요일';
        // }
        userTodo();
      })
    }

    const userTodo = () =>{
      //등록된 식물 투두리스트 날짜에 맞게 가져오기
      axios.post("http://localhost:8800/planttodo",
      { plantname: plantname,
      usernum: state,
      day: daynum
      })
      .then((res) => {
        console.log('daynum', daynum);
        console.log('todotodotodo',res.data[0].task);
        setTask(res.data[0].task, "+1point");
      })
    }

    // const handleCheckboxChange = (taskId) => {
    //   const updatedTasks = tasks.map((task) =>
    //     task.id === taskId && task.date === today
    //       ? { ...task, checked: !task.checked }
    //       : task
    //   );
    //   setTask(updatedTasks);
    // };

    useEffect(() => {
      handleDateClick();
    }, [])

    //dayname 변경되면 userTodo실행
    useEffect(() => {
      userTodo();
    }, [dayname])

    return (<div>
      <Typography.Title className='title' level={4}>투두 리스트</Typography.Title>
        <menu className="btnmenu"> 
          <button className="menubtn" onClick={onInfo}>마이페이지</button>
            <br></br>
              <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
              <button className="menubtn" onClick={onTodo}>To-do list</button>
                <br></br>
              <button className="menubtn">로그아웃</button>
        </menu>         

      <div>
      <Calendar onClickDay={handleDateClick(selectedDate)} />
        <div className="text-gray-500 mt-4">
            {moment(selectedDate).format("YYYY년 MM월 DD일")} 
            <br></br>
        </div>
        {/* <div>
          {tasks.map((task) => (
            <div key={task.id}>
              <input
                type='checkbox'
                checked={task.checked}
                onChange={() => handleCheckboxChange(task.id)}
                disabled={task.date !== today}
              />
              <label>{task}</label>
            </div>
          ))}
        </div> */}
        <div>{task}</div>
      </div>
    </div>
  );


};

export default Todo;