import App from './App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './components/Home';
import Layout from './components/Layout';
import Search from './components/Search';
import Explore from './components/Explore';
import ChirpPage from './components/ChirpPage';
import Landing from './components/Landing';
import UserProfile from './components/UserProfilePage';
import { Router, Route, Outlet, ReactLocation } from '@tanstack/react-location';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
const queryClient = new QueryClient();
const location = new ReactLocation();

const routes: Route[] = [
  {
    path: '/',
    element: (
      <>
        <Landing />
        <Outlet />
      </>
    ),
  },
  {
    path: 'home',
    element: (
      <Layout title='Home'>
        <Home />
        <Outlet />
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
  },
  {
    element: <h1>404 Not Found 💀</h1>,
  },
];

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router location={location} routes={routes}>
        <App />
        <ReactLocationDevtools
          initialIsOpen={false}
          toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
        />
      </Router>
      <ReactQueryDevtools
        initialIsOpen={false}
        position='bottom-right'
        toggleButtonProps={{ style: { bottom: '60px', opacity: '0.7' } }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
