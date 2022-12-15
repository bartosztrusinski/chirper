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
  Search: { dialog?: 'log-in' | 'sign-up' };
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
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();

  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(dialog === 'log-in');
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(
    dialog === 'sign-up',
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
    navigate({ search: (old) => ({ ...old, dialog: 'log-in' }) });

  const openSignUp = () =>
    navigate({ search: (old) => ({ ...old, dialog: 'sign-up' }) });

  const closeDialog = () =>
    navigate({ search: (old) => ({ ...old, dialog: undefined }) });

  const LogInLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={{ dialog: 'log-in' }}
    />
  );

  const SignUpLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={{ dialog: 'sign-up' }}
    />
  );

  useEffect(() => {
    setIsLogInOpen(dialog === 'log-in');
    setIsSignUpOpen(dialog === 'sign-up');
  }, [dialog]);

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

        <Modal isOpen={isLogInOpen} onRequestClose={closeDialog}>
          <LoginForm />
        </Modal>

        <RegisterForm isOpen={isSignUpOpen} onRequestClose={closeDialog} />

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
