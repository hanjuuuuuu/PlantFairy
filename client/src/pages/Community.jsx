import Posts from "../components/Posts.jsx";
import Share from "../components/Share.jsx";
import "../design/community.scss";
import logo from "../img/logo.png";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

const Community = () => {
  const navigate = useNavigate();

  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userPlantEnroll1name, setUserPlantEnroll1name] = useState("");

  const location = useLocation();
  const { state, userpoints, userlevel, userplantnum, userplantname1 } =
    location.state;

  const onInfo = () => {
    navigate("/info");
  };
  const onCommunity = () => {
    //커뮤니티 페이지로 이동
    navigate("/community", { state: state });
  };

  const onTodo = () => {
    //투두리스트 페이지로 이동
    try {
      navigate("/todo", {
        state: {
          state: state,
          userpoints: userPoints,
          userlevel: userLevel,
          userplantnum: userplantnum,
          userplantname1: userplantname1,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onRandom = () => {
    //성향테스트 페이지로 이동
    try {
      navigate("/random", {
        state: {
          state: state,
          userpoints: userPoints,
          userlevel: userLevel,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onMain = () => {
    // 페이지로 이동
    navigate("/main", { state: state });
  };

  const [inputs, setInputs] = useState({
    username: "",
    user_pw: "",
  });

  const [err, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let getUserNum = await login(inputs);
      console.log("user_num: ", getUserNum);
      navigate("/main", { state: getUserNum });
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  return (
    <>
      <div className="main_nav_commu">
        <div className="main_logo_commu">
          <NavLink to={"http://localhost:3000/"}>
            <img src={logo} alt="My Image" width="160" height="60" />
          </NavLink>
        </div>

        <div className="main_nav_but_commu">
          <button onClick={onMain}> 메인페이지 </button>
          <button onClick={onCommunity}> 커뮤니티 </button>
          <button onClick={onTodo}> 투두리스트 </button>
          <button onClick={onRandom}> 식물 성향 테스트 </button>
          <button onClick={handleSubmit}>로그아웃</button>
        </div>
      </div>

      <div className="community">
        <Share />
        <Posts />
      </div>
    </>
  );
};
export default Community;
