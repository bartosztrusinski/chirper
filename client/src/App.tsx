import './App.scss';
import { Router, Route, Outlet, ReactLocation } from '@tanstack/react-location';
import Landing from './components/Landing';
import Home from './components/Home';
import Layout from './components/Layout';

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
    element: <h1>404 Not Found 💀</h1>,
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
