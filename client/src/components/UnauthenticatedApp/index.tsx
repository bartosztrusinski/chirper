import LoginForm from '../LoginForm';
import Modal from '../Modal';
import RegisterForm from '../RegisterForm';
import ReplyPrompt from '../Prompt/ReplyPrompt';
import LikePrompt from '../Prompt/LikePrompt';
import FollowPrompt from '../Prompt/FollowPrompt';
import { createContext, useEffect, useState } from 'react';
import {
  Outlet,
  useSearch,
  useNavigate,
  MakeGenerics,
  Link,
  useLocation,
  LinkProps,
} from '@tanstack/react-location';

type LocationGenerics = MakeGenerics<{
  Search: {
    login?: boolean;
    signup?: boolean;
  };
}>;

interface PromptContext {
  openReplyPrompt: (username: string) => void;
  openLikePrompt: (username: string) => void;
  openFollowPrompt: (username: string) => void;
  closePrompt: () => void;
  openLogIn: () => void;
  openSignUp: () => void;
  LogInLink: (props: LinkProps) => JSX.Element;
  SignUpLink: (props: LinkProps) => JSX.Element;
}

const PromptContext = createContext<PromptContext | null>(null);

const UnauthenticatedApp = () => {
  const location = useLocation();
  const navigate = useNavigate<LocationGenerics>();
  const { login: loginParam, signup: signupParam } =
    useSearch<LocationGenerics>();

  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(loginParam === true);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(
    signupParam === true,
  );

  const [isReplyPromptOpen, setIsReplyPromptOpen] = useState<boolean>(false);
  const [isLikePromptOpen, setIsLikePromptOpen] = useState<boolean>(false);
  const [isFollowPromptOpen, setIsFollowPromptOpen] = useState<boolean>(false);
  const [promptUsername, setPromptUsername] = useState<string>('');

  const openReplyPrompt = (username: string) => {
    setPromptUsername(username);
    setIsReplyPromptOpen(true);
  };

  const openLikePrompt = (username: string) => {
    setPromptUsername(username);
    setIsLikePromptOpen(true);
  };

  const openFollowPrompt = (username: string) => {
    setPromptUsername(username);
    setIsFollowPromptOpen(true);
  };

  const closePrompt = () => {
    setIsReplyPromptOpen(false);
    setIsLikePromptOpen(false);
    setIsFollowPromptOpen(false);
  };

  const openLogIn = () =>
    navigate({
      search: (old) => ({
        ...old,
        login: true,
        signup: undefined,
      }),
    });

  const openSignUp = () =>
    navigate({
      search: (old) => ({
        ...old,
        login: undefined,
        signup: true,
      }),
    });

  const LogInLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={{ login: true, signup: undefined }}
    />
  );

  const SignUpLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={{ login: undefined, signup: true }}
    />
  );

  const closeAuth = () =>
    navigate({
      search: (old) => ({
        ...old,
        login: undefined,
        signup: undefined,
      }),
    });

  useEffect(() => {
    if (loginParam && signupParam) return;
    setIsLogInOpen(loginParam === true);
    setIsSignUpOpen(signupParam === true);
  }, [loginParam, signupParam]);

  return (
    <>
      <PromptContext.Provider
        value={{
          openReplyPrompt,
          openLikePrompt,
          openFollowPrompt,
          openLogIn,
          LogInLink,
          openSignUp,
          SignUpLink,
          closePrompt,
        }}
      >
        <Outlet />

        <Modal isOpen={isLogInOpen} onRequestClose={closeAuth}>
          <LoginForm />
        </Modal>

        <RegisterForm isOpen={isSignUpOpen} onRequestClose={closeAuth} />

        <Modal
          isOpen={isReplyPromptOpen}
          onRequestClose={() => setIsReplyPromptOpen(false)}
          title=' '
        >
          <ReplyPrompt username={promptUsername} />
        </Modal>

        <Modal
          isOpen={isLikePromptOpen}
          onRequestClose={() => setIsLikePromptOpen(false)}
          title=' '
        >
          <LikePrompt username={promptUsername} />
        </Modal>

        <Modal
          isOpen={isFollowPromptOpen}
          onRequestClose={() => setIsFollowPromptOpen(false)}
          title=' '
        >
          <FollowPrompt username={promptUsername} />
        </Modal>
      </PromptContext.Provider>
    </>
  );
};

export default UnauthenticatedApp;
export { PromptContext };
