//import '../design/mypage.css';
import image11 from '../img/image11.png';

const Info = () => {
  return (
    <div className='App'>
      {/* 헤더 */}
      <img src={image11} alt='My Image' width='100' height='100' />
      <h1> 마이 페이지 </h1>
      <br></br>
      <br></br>

      {/* 메인 */}
      <div className='box'>
        <div className='quick1'>
          <h3> 내 프로필 </h3>
        </div>

        <div className='text'>
          <div className='space'>
            <h4> 닉네임 : </h4>
            <h5> 이름 : </h5>
            <h6> 나이 : </h6>
            <h7> 성별 : </h7>
            <p>
              {' '}
              <h8> 이메일 : </h8>{' '}
            </p>
          </div>
        </div>
      </div>

      <div className='level'>
        <h10> 레벨 : </h10>
        <br></br>
        <br></br>
        <h11> 포인트 : </h11>
      </div>

      <div className='box2'>
        <button type='submit'> 로그아웃 </button>
      </div>
    </div>
  );
};

export default Info;
