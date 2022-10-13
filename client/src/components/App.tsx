import '../styles/index.scss';
import {
  Link,
  Outlet,
  MakeGenerics,
  Router,
  Route,
  ReactLocation,
  useMatch,
} from '@tanstack/react-location';
import Home from './Home';
import Landing from './Landing/Landing';
import Profile from './Profile';
import Search from './Search';
import Explore from './Explore';

const location = new ReactLocation();
const routes: Route[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: 'search',
    element: <Search />,
  },
  {
    path: 'explore',
    element: <Explore />,
  },
  {
    path: '*',
    element: <h1>404</h1>,
  },
];

function App() {
  return (
    <Router location={location} routes={routes}>
      <Outlet />
    </Router>
  );
}

export default App;
