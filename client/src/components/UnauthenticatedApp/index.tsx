import LogInForm from '../LogInForm';
import Modal from '../Modal';
import RegisterForm from '../RegisterForm';
import LikePromptModal from '../Prompt/LikePromptModal';
import FollowPromptModal from '../Prompt/FollowPromptModal';
import ReplyPromptModal from '../Prompt/ReplyPromptModal';
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
    navigate({
      search: (old) => ({ ...old, dialog: 'log-in' }),
      replace: true,
    });

  const openSignUp = () =>
    navigate({
      search: (old) => ({ ...old, dialog: 'sign-up' }),
      replace: true,
    });

  const closeDialog = () =>
    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });

  const LogInLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={(old) => ({ ...old, dialog: 'log-in' })}
      replace={true}
    />
  );

  const SignUpLink = (props: LinkProps) => (
    <Link
      {...props}
      to={location.current.pathname}
      search={(old) => ({ ...old, dialog: 'sign-up' })}
      replace={true}
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
          <LogInForm />
        </Modal>

        <RegisterForm isOpen={isSignUpOpen} onRequestClose={closeDialog} />

        <ReplyPromptModal
          isOpen={isReplyPromptOpen}
          onRequestClose={() => setIsReplyPromptOpen(false)}
          username={promptUsername}
        />

        <LikePromptModal
          isOpen={isLikePromptOpen}
          onRequestClose={() => setIsLikePromptOpen(false)}
          username={promptUsername}
        />

        <FollowPromptModal
          isOpen={isFollowPromptOpen}
          onRequestClose={() => setIsFollowPromptOpen(false)}
          username={promptUsername}
        />
      </PromptContext.Provider>
    </>
  );
};

export default UnauthenticatedApp;
export { PromptContext };
