import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal, Space, Spin } from 'antd';
import axios from 'axios';
import Main from './Main.jsx';
import { Link, useNavigate } from 'react-router-dom';

const SatisfiedRec = (req, res) => {
  const [experience, setExperience] = useState('');
  const [onExperience, setOnExperience] = useState(false);
  const [isMain, setIsMain] = useState(false);
  const [plantName, setPlantName] = useState(null);

  const navigate = useNavigate();

  const onUserPlantPrint = () => {
    // user_plant 테이블에서 사용자의 식물 정보 가져와 메인 식물 정보 테이블로 출력
    // axios
    //   .post('http://localhost:8800/getbeforplant', { usernum: currentUser.user_num })
    //   .then((response) => {
    //     const plant_name = response.data[0].plant_name;
    //     console.log('Plantname : ', plant_name);
    //     setPlantName(plant_name);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  const handleButton = (event) => {
    const name = event.target.value;
    if (name === 'yes') {
      setExperience(`${plantName} experienced person`);
      setOnExperience(true);
      navigate('/satisfied');
    } else {
      setExperience('beginner');
      navigate('/unsatisfied');
    }
  };

  useEffect(() => {
    onUserPlantPrint();
  }, []);

  // plant 선택한 결과 db에 저장해서 받아오기
  return isMain ? (
    <Main />
  ) : (
    <div className='Experience'>
      {<p>{plantName}와 비슷한 식물을 추천받으시겠어요?</p>}
      <div>
        <div>
          <button className='btn' value='yes' onClick={handleButton}>
            yes
          </button>
        </div>
        <br></br>
        <div>
          <button className='btn' value='no' onClick={handleButton}>
            no
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatisfiedRec;
