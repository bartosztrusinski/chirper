import './App.scss';
import { Outlet } from '@tanstack/react-location';
import QueryProvider from './components/QueryProvider';
import RouterProvider from './components/RouterProvider';
import ThemeProvider from './components/ThemeProvider';
import ModalProvider from './components/ModalProvider';
import Toaster from './components/Toaster';

const App = () => {
  return (
    <QueryProvider>
      <RouterProvider>
        <ThemeProvider>
          <ModalProvider>
            <Outlet />
            <Toaster />
          </ModalProvider>
        </ThemeProvider>
      </RouterProvider>
    </QueryProvider>
  );
};

export default App;
