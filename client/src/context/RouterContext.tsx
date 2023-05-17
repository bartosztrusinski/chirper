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
  DefaultGenerics,
} from '@tanstack/react-location';
import {
  ChirpDetail,
  CreatedChirpsPanel,
  CreatedChirpsWithRepliesPanel,
  LikedChirpsPanel,
  loadAllChirps,
  loadChirp,
  loadFeedChirps,
  loadLikedChirps,
  loadReplyChirps,
  loadSearchChirps,
  loadUserChirps,
  loadUserChirpsWithReplies,
  ReplyChirps,
} from '../features/chirps';
import { loadUser, UserProfile } from '../features/users';
import { LocationGenerics } from '../interface';

const location = new ReactLocation();

const routes: Route<LocationGenerics & DefaultGenerics>[] = [
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
          {
            path: '/',
            loader: loadFeedChirps,
            element: <Home />,
          },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'search',
        children: [
          {
            path: '/',
            loader: ({ search: { query } }) => loadSearchChirps(query),
            element: <Search />,
          },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'explore',
        children: [
          {
            path: '/',
            loader: loadAllChirps,
            element: <Explore />,
          },
          { element: <Navigate to='.' /> },
        ],
      },

      {
        path: 'chirps',
        children: [
          { path: '/', element: <NotFound /> },
          {
            path: ':id',
            loader: ({ params: { id } }) => loadChirp(id),
            element: <ChirpDetail />,
            children: [
              {
                path: '/',
                loader: ({ params: { id } }) => loadReplyChirps(id),
                element: <ReplyChirps />,
              },
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
            loader: ({ params: { username } }) => loadUser(username),
            element: <UserProfile />,
            children: [
              {
                path: '/',
                loader: ({ params: { username } }) => loadUserChirps(username),
                element: <CreatedChirpsPanel />,
              },
              {
                path: 'with-replies',
                children: [
                  {
                    path: '/',
                    loader: ({ params: { username } }) =>
                      loadUserChirpsWithReplies(username),
                    element: <CreatedChirpsWithRepliesPanel />,
                  },
                  { element: <Navigate to={`.`} /> },
                ],
              },
              {
                path: 'likes',
                children: [
                  {
                    path: '/',
                    loader: ({ params: { username } }) =>
                      loadLikedChirps(username),
                    element: <LikedChirpsPanel />,
                  },
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
