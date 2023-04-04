import {Form, Radio, Button} from 'antd';
import React, {useState}from 'react';

const App = () => {
  /**
   * 페이지에서 사용하는 상태변수
   */
  const [onExperience, setOnExperience] = useState(false);
  const [onTime, setOnTime] = useState(false);
  const [onAddress, setOnAddress] = useState(false);
  const [onSize, setOnSize] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [onFunction, setOnFunction] = useState(false);

  const userOrderPlant = {
    "experience": "",
    "time": "",
    "address": "",
    "size": "",
    "light": "",
    "function": ""
  }

  const handleExperienceButton = (event) => {
    const name = event.target.value;
    if(name === 'yes'){
      userOrderPlant.experience = "";
    }
    else{
      userOrderPlant.experience = "초보자가";
    }
    setOnExperience(true);
    console.log(userOrderPlant);
  }

  const handleTimeButton = (event) => {
    const name = event.target.value;
    if(name === 'yes')
      userOrderPlant.time = "주기적으로 참여하며";
    else{
      userOrderPlant.time = "체계적인 관리없이";
    }
    setOnTime(true);
    console.log(userOrderPlant);
  }
  
  const handleAddressButton = (event) => {
    const name = event.target.value;
    if(name === 'yes')
      userOrderPlant.address = "실내에서 키우고";
    else{
      userOrderPlant.address = "실외에서 키우고";
    }
    setOnAddress(true);
    console.log(userOrderPlant);
  }

  const handleSizeButton = (event) => {
    const name = event.target.value;
    if(name === 'yes')
      userOrderPlant.address = "큰 크기의";
    else if(name == ''){
      userOrderPlant.address = "중간 크기의";
    }
    else{
      userOrderPlant.address = "작은 크기의";
    }
    setOnSize(true);
    console.log(userOrderPlant);
  }

  const handleLightButton = (event) => {
    const name = event.target.value;
    if(name === 'yes')
      userOrderPlant.address = "빛을 많이 받는";
    else if(name ==''){
      userOrderPlant.address = "빛을 적당히 받는";
    }
    else{
      userOrderPlant.address = "빛을 적게 받는";
    }
    setOnLight(true);
    console.log(userOrderPlant);
  }

  const handleFunctionButton = (event) => {
    const name = event.target.value;
    if(name === 'yes')
      userOrderPlant.address = "공기정화";
    else if(name = ''){
      userOrderPlant.address = "장식";
    }
    setOnFunction(true);
    console.log(userOrderPlant);
  }

  return (
    onFunction?<div>추천중입니다.</div>
    : onLight? <div className="Function">
  <p>
    원하는 식물의 기능이 있나요?
  </p>
  <div>
    <button value="yes" onClick={handleFunctionButton}>공기 정화</button>
    <button value="no" onClick={handleFunctionButton}>장식</button>
  </div> </div>: 
  onSize ? <div className="Light">
      <p>
        광량 조건은 어떻게 되나요?
      </p>
      <div>
        <button value="yes" onClick={handleLightButton}>많다</button>
        <button value="no" onClick={handleLightButton}>적당하다</button>
      </div>
      </div> :
    onAddress ? <div className="Size">
      <p>
        원하는 식물의 크기가 있나요?
      </p>
      <div>
        <button value="yes" onClick={handleSizeButton}>크다</button>
        <button value="no" onClick={handleSizeButton}>중간</button>
      </div>
      </div> :
    onTime? <div className="Address">
      <p>
        식물을 키우는 장소는 어디인가요?
      </p>
      <div>
        <button value="yes" onClick={handleAddressButton}>실내</button>
        <button value="no" onClick={handleAddressButton}>실외</button>
      </div>
      </div> :
    onExperience? <div className="Time">
      <p>
        식물 관리에 참여할 수 있는 시간이 얼마나 되나요?
      </p>
      <div>
        <button value="yes" onClick={handleTimeButton}>주기적으로 참여 가능</button>
        <button value="no" onClick={handleTimeButton}>체계적인 관리 없이도 잘 자랐으면 좋겠음</button>
      </div>
      </div> : 
      <div className="Experience">
      <p>
        식물을 키워본 적이 있으신가요?
      </p>
      <div>
        <button value="yes" onClick={handleExperienceButton}>yes</button>
        <button value="no" onClick={handleExperienceButton}>no</button>
      </div>
  </div>
  );
}

export default App;
