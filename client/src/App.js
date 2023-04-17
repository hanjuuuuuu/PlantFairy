import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import Main from './pages/Main';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
//import './common.scss';
//import './login.scss';
import './style.scss';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <Footer />
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
