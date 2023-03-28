import './App.scss';
import { Outlet } from '@tanstack/react-location';
import QueryProvider from './context/QueryContext';
import RouterProvider from './context/RouterContext';
import ThemeProvider from './context/ThemeContext';
import ModalProvider from './context/ModalContext';
import Toaster from './components/ui/Toaster';

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
