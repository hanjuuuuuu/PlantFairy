import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import Main from './pages/Main';
import Info from './pages/MyPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
//import './common.scss';
//import './login.scss';
import './style.scss';
import Community from './pages/Community';
import Todo from './pages/Todo';
import Random from './pages/Random';

const Layout = () => {
  return (
    <div>
      <Home />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/main',
    element: <Main />,
  },
  {
    path: '/info',
    element: <Info />,
  },
  {
    path: '/community',
    element: <Community/>,
  },
  {
    path: '/todo',
    element: <Todo/>,
  },
  {
    path: '/random',
    element: <Random/>,
  }
]);

function App() {
  return (
    <div className='app'>
      <div className='container'>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
