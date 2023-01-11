import Home from '../Home';
import Layout from '../Layout';
import Search from '../Search';
import Explore from '../Explore';
import ChirpPage from '../ChirpPage';
import Landing from '../Landing';
import UserProfile from '../UserProfilePage';
import UserChirps from '../UserChirps';
import UserLikedChirps from '../UserChirps/liked';
import NotFound from '../NotFound';
import { lazy, ReactNode } from 'react';
import {
  ReactLocation,
  Router,
  Route,
  Outlet,
  Navigate,
} from '@tanstack/react-location';

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
          { path: '/', element: <NotFound /> },
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
          { path: '/', element: <NotFound /> },
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

      { element: <NotFound /> },
    ],
  },
];

const ReactLocationDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null
    : lazy(() =>
        import('@tanstack/react-location-devtools').then((res) => ({
          default: res.ReactLocationDevtools,
        })),
      );

interface RouterProviderProps {
  children: ReactNode;
}

const RouterProvider = ({ children }: RouterProviderProps) => {
  return (
    <Router location={location} routes={routes}>
      {children}
      <ReactLocationDevtools
        initialIsOpen={false}
        toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
      />
    </Router>
  );
};

export default RouterProvider;
