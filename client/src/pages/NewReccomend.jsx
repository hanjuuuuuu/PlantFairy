import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Space, Spin } from 'antd';
import axios from 'axios';
import { AuthContext } from '../context/authContext.js';
import Main from './Main.jsx';
import StarRating from '../components/StarRating.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NewReccomend = ({ usernum, buttonValue }) => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [experience, setExperience] = useState('');
  const [onExperience, setOnExperience] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const [isyes, setIsYes] = useState(false);
  const [isno, setIsNo] = useState(false);
  const [issimilar, setIsSimilar] = useState(false);
  const [isdifferent, setIsDifferent] = useState(false);
  const [plantName, setPlantName] = useState(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState('');
  const [recommendPlant, setrecommendPlant] = useState('');
  const [plantContext, setPlantContext] = useState('');
  const [plantImages, setPlantImages] = useState([]);

  const { state } = useLocation();

  // 별점이 안눌렸다면 다음 페이지로 넘어갈 수 없어야 함..

  const [checkedItems, setCheckedItems] = useState([]);

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
    axios
      .post('http://localhost:8800/getbeforplant', { usernum: currentUser.user_num })
      .then((response) => {
        const plant_name = response.data[0].plant_name;
        console.log('Plantname : ', plant_name);
        setPlantName(plant_name);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleExperienceButton = (e) => {
    const value = e.target.value;
    if (value === 'yes') {
      setExperience(`${plantName} experienced person`);
      setIsYes(true);
      setIsNo(false);
    } else if (value === 'no') {
      setExperience('beginner');
      setIsYes(false);
      setIsNo(true);
    }
    setOnExperience(true);
  };

  const handleButton = (e) => {
    const value = e.target.value;
    if (value === 'similar') {
      setIsSimilar(true);
      setIsDifferent(false);
    } else if (value === 'different') {
      setIsSimilar(false);
      setIsDifferent(true);
    }
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const handleSubmitButton = async () => {
    console.log('Front1');
    const response = await fetch('http://localhost:8800/unsatisfied', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reasons: checkedItems, plantName }),
    });
  };

  const showModal = (event) => {
    const value = event.target.value;
    const text = value.split(',');
    console.log(text[0]);
    setrecommendPlant(text[0]);
    setPlantContext(text[1]);
    setOpen(true);
  };

  const handleOk = async () => {
    //console.log('button', buttonValue);

    axios
      .post('http://localhost:8800/plantenroll', {
        usernum: usernum,
        plantmain: buttonValue,
        plantname: recommendPlant,
        //plantpicture: imagePath,
        plantcharacteristic: plantContext,
      })
      .then((response) => {
        alert('등록되었습니다');
        console.log('response.data in RECCOMEND: ', response.data);
        setIsMain(true);
      })
      .catch((error) => {
        console.log(error);
      });

    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    onUserPlantPrint();
  }, []);

  return isMain ? (
    <Main />
  ) : isyes ? (
    <div className='Experience'>
      <div>
        {issimilar ? (
          <>
            <div>More content here</div>
          </>
        ) : isdifferent ? (
          <>
            <div>Some here</div>
          </>
        ) : (
          <>
            {<p>{plantName}와 비슷한 식물을 추천받으시겠어요? 아니면 새로 추천을 받으시겠어요?</p>}
            <div>
              <button className='btn' value='similar' onClick={handleButton}>
                비슷한
              </button>
            </div>
            <br></br>
            <div>
              <button className='btn' value='different' onClick={handleButton}>
                새 추천
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : isno ? (
    <div className='Experience'>
      <p>{plantName}가 별로였던 점을 말해주시면 새로 추천해드릴게요</p>
      <label>
        <input type='checkbox' value='가격' checked={checkedItems.includes('가격')} onChange={handleCheckboxChange} />
        가격
      </label>
      <label>
        <input type='checkbox' value='관리의 어려움' checked={checkedItems.includes('관리의 어려움')} onChange={handleCheckboxChange} />
        관리의 어려움
      </label>
      <label>
        <input type='checkbox' value='알레르기 반응' checked={checkedItems.includes('알레르기 반응')} onChange={handleCheckboxChange} />
        알레르기 반응
      </label>
      <div>
        <button className='btn' value='different' onClick={handleSubmitButton}>
          제출
        </button>
      </div>
    </div>
  ) : (
    <div className='Experience'>
      {plantName && <p>{plantName}에 대한 추천이 마음에 들었나요?</p>}
      <div>
        <div>
          <button className='btn' value='yes' onClick={handleExperienceButton}>
            yes
          </button>
        </div>
        <br></br>
        <div>
          <button className='btn' value='no' onClick={handleExperienceButton}>
            no
          </button>
        </div>

        <div>
          <StarRating />
        </div>
      </div>
    </div>
  );
};

export default NewReccomend;
