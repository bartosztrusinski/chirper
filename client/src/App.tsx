import './App.scss';
import Home from './components/Home';
import Layout from './components/Layout';
import Search from './components/Search';
import Explore from './components/Explore';
import ChirpPage from './components/ChirpPage';
import Landing from './components/Landing';
import UserProfile from './components/UserProfilePage';
import UserChirps from './components/UserChirps';
import UserLikedChirps from './components/UserChirps/liked';
import useUser from './hooks/useUser';
import AuthenticatedApp from './components/AuthenticatedApp';
import UnauthenticatedApp from './components/UnauthenticatedApp';
import { ReactLocation, Router, Route, Outlet } from '@tanstack/react-location';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';

const location = new ReactLocation();
const routes: Route[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: 'home',
    element: (
      <Layout title='Home'>
        <Home />
      </Layout>
    ),
  },
  {
    path: 'search',
    element: (
      <Layout title='Search'>
        <Search />
      </Layout>
    ),
  },
  {
    path: 'explore',
    element: (
      <Layout title='Explore'>
        <Explore />
      </Layout>
    ),
  },
  {
    path: 'chirps/:id',
    element: (
      <Layout title='Chirp'>
        <ChirpPage />
      </Layout>
    ),
  },
  {
    path: 'users/:username',
    element: (
      <Layout title='User'>
        <UserProfile />
      </Layout>
    ),
    children: [
      {
        path: '/',
        element: <UserChirps />,
      },
      {
        path: 'with-replies',
        element: <UserChirps withReplies />,
      },
      {
        path: 'likes',
        element: <UserLikedChirps />,
      },
    ],
  },
  {
    element: (
      <Layout title='Not Found'>
        <h1>404 Not Found 💀</h1>
      </Layout>
    ),
  },
];

const App = () => {
  // const { user } = useUser();

  return (
    <Router location={location} routes={routes}>
      <Outlet />
      <ReactLocationDevtools
        initialIsOpen={false}
        toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
      />
    </Router>
  );
};

export default App;
