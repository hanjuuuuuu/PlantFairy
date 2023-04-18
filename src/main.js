import React, {useState, useEffect} from "react";
import { Button, Table } from 'antd';
import axios from 'axios';
import './main.css';
import App from './App.js';
import Community from './community';
import Info from './info';

//메인페이지. 키우는 식물 슬롯들이 출력되고 +버튼을 누르면 식물을 추천해주고 등록할 수 있게 한다.

const Main = () => {
    /**
     *  페이지에서 사용하는 상태변수
     */
    const [isRecommend, setIsRecommend] = useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const [isCommunity, setIsCommunity] = useState(false);
    const [userPlantInfo, setUserPlantInfo] = useState([]);

    /**
     * 
     *  화면에서 사용하는 이벤트를 정의
     */
    const onClick = (e) => {
        console.log('click', e);
    };

    const onRecommend = () => {     //슬롯 + 누르면 추천페이지로 이동
        setIsRecommend(true);
    }
    const onInfo = () => {  //마이 페이지로 이동
        setIsInfo(true);
    }
    const onCommunity = () => {     //커뮤니티 페이지로 이동
        setIsCommunity(true);
    }

    const columns = [
        {
            title: '식물 이름',
            dataIndex: 'plant_name'
        },
        {
            title: '식물 특성',
            dataIndex: 'plant_characteristic'
        },
        {
            title: '키우기 난이도',
            dataIndex: 'plant_level'
        }
    ];
    
    const data = [
        {
            key:'1',
            plant_name: '비트 (Begonia)',
            plant_characteristic: '비트는 대부분 작고 다양한 형태를 가진 작은 식물로, 강한 광학효과를 얻기 위해 실내에서 자주 기르는 편이다. 충분한 습도와 중간 조명이 필요하며, 온도 차이가 많거나 습도가 너무 낮으면 식물이 약해질 수 있다.',
            plant_level: '초보가 키울만한'
        }
    ]

    // const onUserPlantPrint = (userplantnum) => {    //db에서 식물 정보 가져와 출력
    //     axios.post("/plantpicture",
    //     {userplantnum: userplantnum}
    //     )
    //     .then((res)=> {
    //         console.log(res.data);
    //         setUserPlantInfo(res.data);
    //     })
    //     .catch((err) => {
    //         console.log(err.res);
    //     })
    // };

    // useEffect(()=> {
    //     onUserPlantPrint();
    // }, [])
        
    return (isCommunity ? <Community /> :
        isInfo ? <Info /> :
        isRecommend ? 
        <App /> :
        <div>
            <br></br>
            <h2>식물요정</h2>
            <br></br>
            <div>메인페이지</div>
            <br></br>
            <div>
                <Button className="slot"> plant </Button>
            </div>
            <div>
                <Table  className="tableprint" columns={columns} pagination={false} dataSource={data} size="middle" />
            </div>
            <menu className="btnmenu"> 
                <button className="menubtn" onClick={onInfo}>마이페이지</button>
                <br></br>
                <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
                <br></br>
                <button className="menubtn" >To-do list</button>
                <br></br>
                <button className="menubtn">로그아웃</button>
            </menu>
            <br></br>
            <br></br>
            <div style={{marginLeft: '50%'}}>레벨이 올라가면 슬롯이 확장됩니다!</div>
            <Button className="slots" onClick={onRecommend}> + </Button>
            <Button className="slots" disabled onClick={onRecommend}> + </Button>
            <Button className="slots" disabled onClick={onRecommend}> + </Button>
            <Button className="slots"disabled onClick={onRecommend}> + </Button>
            
        </div>
    );
};

export default Main;