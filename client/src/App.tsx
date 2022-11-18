import './App.scss';
import LoginForm from './components/LoginForm';
import Modal from './components/Modal';
import RegisterForm from './components/RegisterForm';
import { useEffect, useState } from 'react';
import {
  Outlet,
  useSearch,
  useNavigate,
  MakeGenerics,
} from '@tanstack/react-location';

type LocationGenerics = MakeGenerics<{
  Search: {
    login?: boolean;
    signup?: boolean;
  };
}>;

const App = () => {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (search.login && search.signup) return;

    setIsLogInOpen(search.login === true);
    setIsSignUpOpen(search.signup === true);
  }, [search.login, search.signup]);

  return (
    <>
      <Outlet />
      <Modal
        isOpen={isLogInOpen}
        onClose={() =>
          navigate({
            search: (old) => ({ ...old, login: undefined, signup: undefined }),
          })
        }
      >
        <LoginForm />
      </Modal>
      <RegisterForm
        isOpen={isSignUpOpen}
        onClose={() =>
          navigate({
            search: (old) => ({ ...old, login: undefined, signup: undefined }),
          })
        }
      />
    </>
  );
};

export default App;
