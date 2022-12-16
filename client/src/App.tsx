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
import { createContext } from 'react';
import useDarkMode from './hooks/useDarkMode';
import {
  ReactLocation,
  Router,
  Route,
  Outlet,
  Navigate,
} from '@tanstack/react-location';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';

const location = new ReactLocation();
const routes: Route[] = [
  { path: '/', element: <Landing /> },
  {
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),

    children: [
      {
        path: 'home',
        children: [
          { path: '/', element: <Home /> },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'search',
        children: [
          { path: '/', element: <Search /> },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'explore',
        children: [
          { path: '/', element: <Explore /> },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'chirps',
        children: [
          { path: '/', element: <h1>404 Not Found 💀</h1> },
          {
            path: ':id',
            children: [
              { path: '/', element: <ChirpPage /> },
              { element: <Navigate to={`.`} /> },
            ],
          },
        ],
      },

      {
        path: 'users',
        children: [
          { path: '/', element: <h1>404 Not Found 💀</h1> },
          {
            path: ':username',
            element: <UserProfile />,
            children: [
              { path: '/', element: <UserChirps /> },
              {
                path: 'with-replies',
                children: [
                  { path: '/', element: <UserChirps withReplies /> },
                  { element: <Navigate to={`.`} /> },
                ],
              },
              {
                path: 'likes',
                children: [
                  { path: '/', element: <UserLikedChirps /> },
                  { element: <Navigate to={`.`} /> },
                ],
              },
              { element: <Navigate to={`.`} /> },
            ],
          },
        ],
      },

      { element: <h1>404 Not Found 💀</h1> },
    ],
  },
];

interface ThemeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContext | null>(null);

const App = () => {
  const { user } = useUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Router location={location} routes={routes}>
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </ThemeContext.Provider>
      <ReactLocationDevtools
        initialIsOpen={false}
        toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
      />
    </Router>
  );
};

export default App;
export { ThemeContext };
