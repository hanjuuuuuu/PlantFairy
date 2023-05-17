import React, { useState } from 'react';
import '../design/random.css';
import axios from 'axios';
import { Typography, Button, Radio } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const Random = () => {
    /**
   * 페이지에서 사용하는 상태변수
   */
    const [firstAnswer, setFirstAnswer] = useState('');
    const [secondAnswer, setSecondAnswer] = useState('');
    const [thirdAnswer, setThirdAnswer] = useState('');
    const [fourthAnswer, setFourthAnswer] = useState('');
    const [firstQuestion, setFirstQuestion] = useState('');
    const [secondQuestion, setSecondQuestion] = useState('');
    const [thirdQuestion, setThirdQuestion] = useState('');
    const [fourthQuestion, setFourthQuestion] = useState('');


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

    //식물 추천 질문받기
    const userGame = () => {
        axios.post("http://localhost:8800/plantgame",
            {usernum: state}
        )
        .then((res) => {
            setFirstQuestion(res.data[0])
            // setFirstAnswer(res.data[0].first)
            setSecondQuestion(res.data[1])
            // setSecondAnswer(res.data[1].first)
            // setThirdQuestion(res.data[2].question)
            setThirdAnswer(res.data[2])
            // setFourthQuestion(res.data[3].question)
            setFourthAnswer(res.data[3])
            
            console.log('plant game',res.data);
        })
    }

    return (
        <div>
        <Typography.Title className='title' level={4}>식물 추천</Typography.Title>
            <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                    <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                    <br></br>
                <button className="menubtn" onClick={onTodo}>To-do list</button>
                    <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>  
        <Button onClick={userGame}> 재미난 질문을 통한 식물 추천을 받으시겠습니까? </Button>
        <Radio.Group>
                    <Radio value={firstAnswer} onClick={onclick}>{firstQuestion}</Radio>
                    <Radio value={secondAnswer} onClick={onclick}>{secondQuestion}</Radio>
                    <Radio value={firstAnswer} onClick={onclick}>{thirdQuestion}</Radio>
                    <Radio value={secondAnswer} onClick={onclick}>{fourthQuestion}</Radio>
        </Radio.Group> 
        </div>
    );

};

export default Random;