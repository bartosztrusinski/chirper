import { Outlet } from '@tanstack/react-location';
import { createContext, useState } from 'react';
import Chirp from '../../interfaces/Chirp';
import CreateChirpModal from '../CreateChirpModal';

interface CreateChirpContext {
  replyTo: Chirp | null;
  openCreateChirpModal: (replyTo?: Chirp) => void;
  closeCreateChirpModal: () => void;
}

const CreateChirpContext = createContext<CreateChirpContext | null>(null);

const AuthenticatedApp = () => {
  const [isCreateChirpModalOpen, setIsCreateChirpModalOpen] =
    useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<Chirp | null>(null);

  const openCreateChirpModal = (replyTo?: Chirp) => {
    if (replyTo) setReplyTo(replyTo);
    setIsCreateChirpModalOpen(true);
  };

  const closeCreateChirpModal = () => {
    setReplyTo(null);
    setIsCreateChirpModalOpen(false);
  };

  return (
    <CreateChirpContext.Provider
      value={{ replyTo, openCreateChirpModal, closeCreateChirpModal }}
    >
      <Outlet />
      <CreateChirpModal
        isOpen={isCreateChirpModalOpen}
        onRequestClose={closeCreateChirpModal}
      />
    </CreateChirpContext.Provider>
  );
};

export default AuthenticatedApp;
export { CreateChirpContext };
