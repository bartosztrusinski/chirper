import LogInForm from '../LogInForm';
import Modal from '../Modal';
import RegisterForm from '../RegisterForm';
import LikePromptModal from '../Prompt/LikePromptModal';
import FollowPromptModal from '../Prompt/FollowPromptModal';
import ReplyPromptModal from '../Prompt/ReplyPromptModal';
import Chirp from '../../interfaces/Chirp';
import CreateChirpModal from '../CreateChirpModal';
import useUser from '../../hooks/useUser';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useSearch,
  useNavigate,
  MakeGenerics,
  Link,
  LinkProps,
  useLocation,
} from '@tanstack/react-location';

type LocationGenerics = MakeGenerics<{
  Search: { dialog?: 'log-in' | 'sign-up' | 'create-chirp' };
}>;

interface ModalContext {
  openReplyPrompt: (username: string) => void;
  openLikePrompt: (username: string) => void;
  openFollowPrompt: (username: string) => void;
  openLogIn: () => void;
  openSignUp: () => void;
  openCreateChirp: (replyTo?: Chirp) => void;
  close: () => void;
  replyTo: Chirp | null;
  LogInLink: (props: LinkProps) => JSX.Element;
  SignUpLink: (props: LinkProps) => JSX.Element;
}

const ModalContext = createContext<ModalContext | null>(null);

const useModal = () => {
  const modalContext = useContext(ModalContext);

  if (!modalContext) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return modalContext;
};

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const location = useLocation<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();
  const { currentUser } = useUser();

  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(dialog === 'log-in');
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(
    dialog === 'sign-up',
  );
  const [isCreateChirpOpen, setIsCreateChirpOpen] = useState<boolean>(
    dialog === 'create-chirp',
  );
  const [isReplyPromptOpen, setIsReplyPromptOpen] = useState<boolean>(false);
  const [isLikePromptOpen, setIsLikePromptOpen] = useState<boolean>(false);
  const [isFollowPromptOpen, setIsFollowPromptOpen] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<Chirp | null>(null);
  const [promptUsername, setPromptUsername] = useState<string>('');

  useEffect(() => {
    setIsLogInOpen(dialog === 'log-in' && !currentUser);
    setIsSignUpOpen(dialog === 'sign-up' && !currentUser);
    setIsCreateChirpOpen(dialog === 'create-chirp' && Boolean(currentUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

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

  const openLogIn = () => {
    navigate({
      search: (old) => ({ ...old, dialog: 'log-in' }),
      replace: true,
    });
  };

  const openSignUp = () => {
    navigate({
      search: (old) => ({ ...old, dialog: 'sign-up' }),
      replace: true,
    });
  };

  const openCreateChirp = (replyTo?: Chirp) => {
    if (replyTo) {
      setReplyTo(replyTo);
    }

    navigate({
      search: (old) => ({ ...old, dialog: 'create-chirp' }),
      replace: true,
    });
  };

  const close = () => {
    setIsReplyPromptOpen(false);
    setIsLikePromptOpen(false);
    setIsFollowPromptOpen(false);

    navigate({
      search: (old) => ({ ...old, dialog: undefined }),
      replace: true,
    });
    setReplyTo(null);
  };

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

  return (
    <ModalContext.Provider
      value={{
        openReplyPrompt,
        openLikePrompt,
        openFollowPrompt,
        openLogIn,
        openSignUp,
        openCreateChirp,
        close: close,
        replyTo,
        LogInLink,
        SignUpLink,
      }}
    >
      {children}

      <CreateChirpModal isOpen={isCreateChirpOpen} onRequestClose={close} />

      <Modal isOpen={isLogInOpen} onRequestClose={close}>
        <LogInForm />
      </Modal>

      <RegisterForm isOpen={isSignUpOpen} onRequestClose={close} />

      <ReplyPromptModal
        isOpen={isReplyPromptOpen}
        onRequestClose={close}
        username={promptUsername}
      />

      <LikePromptModal
        isOpen={isLikePromptOpen}
        onRequestClose={close}
        username={promptUsername}
      />

      <FollowPromptModal
        isOpen={isFollowPromptOpen}
        onRequestClose={close}
        username={promptUsername}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
export { useModal };
