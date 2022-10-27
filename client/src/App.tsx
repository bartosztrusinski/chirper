import './App.scss';
import { Router, Route, Outlet, ReactLocation } from '@tanstack/react-location';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Landing from './components/Landing';
import Home from './components/Home';
import Layout from './components/Layout';
import Search from './components/Search';
import Explore from './components/Explore';
import ChirpPage from './components/ChirpPage';
import UserProfile from './components/UserProfilePage';

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
  },
  {
    element: <h1>404 Not Found 💀</h1>,
  },
];

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router location={location} routes={routes}>
        <Outlet />
        <ReactLocationDevtools initialIsOpen={false} />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

export default App;
