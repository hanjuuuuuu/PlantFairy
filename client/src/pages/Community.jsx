import Posts from '../components/Posts.jsx';
import Share from '../components/Share.jsx';
import '../design/community.scss';
import logo from '../img/logo.png';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';

const Community = () => {
  const navigate = useNavigate();

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
      <div className='main_nav_commu'>
        <div className='main_logo_commu'>
          <NavLink to={'http://localhost:3000/'}>
            <img src={logo} alt='My Image' width='160' height='60' />
          </NavLink>
        </div>

        <div className='main_nav_but_commu'>
          <Link to='/main'> 메인 페이지 </Link>
          <Link to='/community'> 커뮤니티 </Link>
          <Link to='/todo'> to-do list </Link>
          <Link to='/random'> 식물 성향 테스트 </Link>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className='community'>
        <Share />
        <Posts />
      </div>
    </>
  );
};
export default Community;
