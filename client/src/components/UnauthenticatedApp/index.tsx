import LoginForm from '../LoginForm';
import Modal from '../Modal';
import RegisterForm from '../RegisterForm';
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

const UnauthenticatedApp = () => {
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
        onRequestClose={() =>
          navigate({
            search: (old) => ({
              ...old,
              login: undefined,
              signup: undefined,
            }),
          })
        }
      >
        <LoginForm />
      </Modal>
      <RegisterForm
        isOpen={isSignUpOpen}
        onClose={() =>
          navigate({
            search: (old) => ({
              ...old,
              login: undefined,
              signup: undefined,
            }),
          })
        }
      />
    </>
  );
};

export default UnauthenticatedApp;
