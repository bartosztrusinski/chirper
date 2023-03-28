import Layout from '../components/ui/Layout';
import Landing from '../pages/Landing';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Explore from '../pages/Explore';
import NotFound from '../pages/NotFound';
import { lazy, ReactNode } from 'react';
import {
  ReactLocation,
  Router,
  Route,
  Outlet,
  Navigate,
} from '@tanstack/react-location';
import {
  ChirpDetail,
  CreatedChirpsPanel,
  CreatedChirpsWithRepliesPanel,
  LikedChirpsPanel,
} from '../features/chirps';
import { UserProfile } from '../features/users';

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
              { path: '/', element: <ChirpDetail /> },
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
              { path: '/', element: <CreatedChirpsPanel /> },
              {
                path: 'with-replies',
                children: [
                  { path: '/', element: <CreatedChirpsWithRepliesPanel /> },
                  { element: <Navigate to={`.`} /> },
                ],
              },
              {
                path: 'likes',
                children: [
                  { path: '/', element: <LikedChirpsPanel /> },
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
