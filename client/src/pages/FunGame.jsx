import React, { useState, useEffect } from 'react';
import { Typography, Spin, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import '../design/fungame.css';

const FunGame = () => {
    /**
   * 페이지에서 사용하는 상태변수
   */
    const [first, setFirst] = useState(false);
    const [second, setSecond] = useState(false);
    const [third, setThird] = useState(false);
    const [fourth, setFourth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onExtrovert, setExtrovert] = useState('');
    const [onIntuitive, setIntuitive] = useState('');
    const [onEmotional, setEmotional] = useState('');
    const [onRecognition, setRecognition] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

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

    const handleFirstButton = (event) => {
        const name = event.target.value;
        console.log(name);
        if (name === 'e') setExtrovert('e');
        else setExtrovert('i');
        setFirst(true);
    };

    const handleSecondButton = (event) => {
        const name = event.target.value;
        console.log(name);
        if (name === 's') setIntuitive('s');
        else setIntuitive('n');
        setSecond(true);
    };

    const handleThirdButton = (event) => {
        const name = event.target.value;
        console.log(name);
        if (name === 't') setEmotional('t');
        else setEmotional('f');
        setThird(true);
    };

    const handleFourthButton = (event) => {
        const name = event.target.value;
        console.log(name);
        if (name === 'j') setRecognition('j');
        else setRecognition('p');
        setFourth(true);
    };

    const text = `${onExtrovert}${onIntuitive}${onEmotional}${onRecognition}`;
    console.log('text: ', text);

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            setLoading(true);
            const response = await fetch('http://localhost:8800/plantgame', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            })
        
            // plant recommendations API call
            //const res1 = await axios.post('http://localhost:8800/recommend', { message });
            //setPlantRecommendations(res1.data.message);
        
            //plant image creation API call
            // const res2 = await axios.post('http://localhost:8800/', { message });
            // setPlantImages(res2.data.images);
        
            //.then((res) => res.json())
            const result = await response.json()
            .then((data) => setResponse(data.message), setLoading(false));
        } catch(error){
            window.alert(error);
        }
        };

    return loading? <div>
    <Typography.Title className='title' level={4}>식물 추천</Typography.Title>
    <menu className="btnmenu"> 
            <button className="menubtn" onClick={onInfo}>마이페이지</button>
            <br></br>
            <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
            <br></br>
            <button className="menubtn" >To-do list</button>
            <br></br>
            <button className="menubtn">로그아웃</button>
    </menu>
    <form onSubmit={handleSubmit}>
        <button className='resultbtn' type='submit' value={`${text}`} onClick={() => {setMessage(`${text}`)}}>
        결과를 보시겠습니까?
        </button>
    </form>
    <br></br>
    <br></br>
    <div className='spin'>
    <Space
    direction="vertical"
    >
    <Spin tip="Loading" size="large">
        <div className="content" />
    </Spin>
</Space>
</div></div> : fourth? <div>
    <Typography.Title className='title' level={4}>식물 추천</Typography.Title>
    <menu className="btnmenu"> 
            <button className="menubtn" onClick={onInfo}>마이페이지</button>
            <br></br>
            <button className="menubtn" onClick={onCommunity}>커뮤니티</button>
            <br></br>
            <button className="menubtn" >To-do list</button>
            <br></br>
            <button className="menubtn">로그아웃</button>
    </menu>
    <form onSubmit={handleSubmit}>
        <button className='resultbtn' type='submit' value={`${text}`} onClick={() => {setMessage(`${text}`)}}>
        결과를 보시겠습니까?
        </button>
    </form>
    <br></br>
    <br></br>
    {Array.isArray(response) &&
    response.map((plant) => (
        <div>
            <div className='recommend'>{plant.context}</div>
            <br></br>
        </div>
    ))}
</div>:third? <div>
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
    <h3 className='question'> 4. 만약 당신이 우주 탐험가라면, 어떤 행성을 먼저 탐사하고 싶으세요?</h3>
    <br></br>
        <div>
        <button className='btn' value='j' onClick={handleFourthButton}>
        외계 생명체가 존재할 것으로 예상되는 행성을 먼저 탐사하고 싶어요. 
        </button>
        <br></br>
        <button className='btn' value='p' onClick={handleFourthButton}>
        다양한 천체들이 존재하는 우주 행성을 먼저 탐사하고 싶어요.
        </button>
        <br></br>
        <button className='btn' value='j' onClick={handleFourthButton}>
        자원이 풍부한 행성을 먼저 탐사하고 싶어요.
        </button>
        <br></br>
        <button className='btn' value='p' onClick={handleFourthButton}>
        미지의 행성을 모험하고 싶어요.
        </button>
        </div>
    </div> : second ? <div>
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
            <h3 className='question'>3. 당신은 신비로운 숲으로 들어가게 되었습니다. 숲 속에서 갑자기 맑은 목소리가 들립니다. </h3>
            <h3 className='question'>그 목소리는 무엇을 말하고 있을까요?</h3>
            <br></br>
            <div>
            <button className='btn' value='t' onClick={handleThirdButton}>
            "이 숲은 비밀을 감추고 있으며 탐험을 해야만 발견됩니다."
            </button>
            <br></br>
            <button className='btn' value='f' onClick={handleThirdButton}>
            "이 숲은 심장의 안식처이며 자연과의 조화를 상징합니다." 
            </button>
            <br></br>
            <button className='btn' value='f' onClick={handleThirdButton}>
            "이 숲은 안전하고 평화로운 곳이며 신뢰와 안정을 찾을 수 있습니다." 
            </button>
            <br></br>
            <button className='btn' value='t' onClick={handleThirdButton}>
            "이 숲은 창의성과 상상력이 자유로워지는 영감의 근원입니다." 
            </button>
            </div>
        </div> 
    : first? <div>
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
        <h3 className='question'>2. 이른 아침 산책을 나갔을 때 갑자기 새들이 하늘에서 날아다니며 소리를 내고 있습니다. </h3>
        <h3 className='question'>당신은 어떤 해석을 하시나요?</h3>
        <br></br>
            <div>
            <button className='btn' value='s' onClick={handleSecondButton}>
            새들이 식량을 찾기 위해 모여든 것일 것이라고 생각합니다. 
            </button>
            <br></br>
            <button className='btn' value='n' onClick={handleSecondButton}>
            새들이 어떤 예언적인 메시지를 전하려고 하는 것일 것이라고 생각합니다. 
            </button>
            <br></br>
            <button className='btn' value='s' onClick={handleSecondButton}>
            새들이 사회적인 이벤트에 참여하며 소통하고 있는 것일 것이라고 생각합니다. 
            </button>
            <br></br>
            <button className='btn' value='n' onClick={handleSecondButton}>
            새들의 행동이 우리 주변에 일어나는 일들에 대한 징조일 것이라고 생각합니다.
            </button>
            </div>
        </div> :
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
        <h3 className='question'>1. 배가 고픈 상황에서 선택할 수 있는 음식 중 어떤 것을 선호하나요? </h3>
        <br></br>
            <div>
            <button className='btn' value='e' onClick={handleFirstButton}>
            혼자 가서 빠르게 먹을 수 있는 패스트푸드나 테이크아웃을 선호합니다. 
            </button>
            <br></br>
            <button className='btn' value='i' onClick={handleFirstButton}>
            아늑한 카페나 식당에서 여유롭게 식사하며 분위기를 즐기고 싶습니다. 
            </button>
            <br></br>
            <button className='btn' value='e' onClick={handleFirstButton}>
            친구들과 함께 다양한 메뉴를 시키고 나누며 소통과 함께 먹는 것을 선호합니다.
            </button>
            <br></br>
            <button className='btn' value='i' onClick={handleFirstButton}>
            집에서 혼자 조용히 식사하며 내 생각에 몰두하고 싶습니다. 
            </button>
            </div>
            </div>
    
}

export default FunGame;