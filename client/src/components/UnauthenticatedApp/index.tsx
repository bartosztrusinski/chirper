import LoginForm from '../LoginForm';
import Modal from '../Modal';
import RegisterForm from '../RegisterForm';
import { createContext, useEffect, useState } from 'react';
import {
  Outlet,
  useSearch,
  useNavigate,
  MakeGenerics,
} from '@tanstack/react-location';
import ReplyPrompt from '../Prompt/ReplyPrompt';

type LocationGenerics = MakeGenerics<{
  Search: {
    login?: boolean;
    signup?: boolean;
  };
}>;

interface PromptContext {
  openReplyPrompt: (username: string) => void;
  closeReplyPrompt: () => void;
}

const PromptContext = createContext<PromptContext | null>(null);

const UnauthenticatedApp = () => {
  const search = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isReplyPromptOpen, setIsReplyPromptOpen] = useState<boolean>(false);
  const [promptUsername, setPromptUsername] = useState<string>('');

  const openReplyPrompt = (username: string) => {
    setPromptUsername(username);
    setIsReplyPromptOpen(true);
  };

  const closeReplyPrompt = () => {
    setPromptUsername('');
    setIsReplyPromptOpen(false);
  };

  useEffect(() => {
    if (search.login && search.signup) return;

    setIsLogInOpen(search.login === true);
    setIsSignUpOpen(search.signup === true);
  }, [search.login, search.signup]);

  return (
    <>
      <PromptContext.Provider value={{ openReplyPrompt, closeReplyPrompt }}>
        <Outlet />
      </PromptContext.Provider>
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
        onRequestClose={() =>
          navigate({
            search: (old) => ({
              ...old,
              login: undefined,
              signup: undefined,
            }),
          })
        }
      />
      <Modal
        isOpen={isReplyPromptOpen}
        onRequestClose={() => setIsReplyPromptOpen(false)}
        title=' '
      >
        <ReplyPrompt username={promptUsername} />
      </Modal>
    </>
  );
};

export default UnauthenticatedApp;
export { PromptContext };
