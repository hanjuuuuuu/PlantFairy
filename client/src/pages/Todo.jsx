import React, { useState, useEffect } from 'react';
import '../design/todo.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography} from 'antd';
import Calendar from 'react-calendar';
//import 'react-calendar/dist/Calendar.css'; 
import moment from 'moment';

const Todo = () => {
    //const { token } = theme.useToken();
    const [value, onChange] = useState(new Date());

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
    console.log('usernum',state);
    let plantname;
    let userplantnum;

    //식물이름 가져오기
    const userMainPlant = async() => {     
      axios.post("http://localhost:8800/plantall",
      {usernum: state})
      .then((res) => {
        userplantnum = res.data[(res.data.length-1)].key;
        plantname = res.data[(res.data.length-1)].plant_name;
        console.log(userplantnum, plantname);
        //등록된 식물 투두리스트 가져오기
        axios.post("http://localhost:8800/planttodo",
        { plantname: plantname,
        userplantnum: userplantnum
        })
        .then((res) => {
          console.log('todotodotodo',res.data)
        })
      })
    }

    //등록된 식물 투두리스트 가져오기
    // const plantTodo = async() => {
    //   axios.post("http://localhost:8800/planttodo",
    //   { plantname: plantname,
    //     userplantnum: userplantnum
    //   })
    //   .then((res) => {
    //     console.log('todotodotodo',res.data)
    //   })
    // }

    const getListData = (value) => {
      let listData;
      switch (value.date()) {
        case '월요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event.',
            },
          ];
          break;
        case '화요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event.',
            },
          ];
          break;
        case '수요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event',
            },
          ];
        case '목요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event',
            },
          ];
        case '금요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event',
            },
          ];
        case '토요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event',
            },
          ];
        case '일요일':
          listData = [
            {
              type: 'warning',
              content: 'This is warning event',
            },
          ];
          break;
        default:
      }
      return listData || [];
    };

    useEffect(() => {
      userMainPlant();
    }, [])

    return (
      <div>
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
        <Calendar onChange={onChange} value={value} />
          <div className="text-gray-500 mt-4">
              {moment(value).format("YYYY년 MM월 DD일")} 
              <br></br>
              <div className='todo'> todo 리스트 출력 </div>
          </div>
        </div>
      </div>
    );


};

export default Todo;