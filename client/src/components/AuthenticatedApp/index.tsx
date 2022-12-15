import {
  MakeGenerics,
  Outlet,
  useNavigate,
  useSearch,
} from '@tanstack/react-location';
import { createContext, useEffect, useState } from 'react';
import Chirp from '../../interfaces/Chirp';
import CreateChirpModal from '../CreateChirpModal';

type LocationGenerics = MakeGenerics<{
  Search: { dialog?: 'create-chirp' };
}>;

interface CreateChirpContext {
  replyTo: Chirp | null;
  openCreateChirpModal: (replyTo?: Chirp) => void;
  closeCreateChirpModal: () => void;
}

const CreateChirpContext = createContext<CreateChirpContext | null>(null);

const AuthenticatedApp = () => {
  const navigate = useNavigate<LocationGenerics>();
  const { dialog } = useSearch<LocationGenerics>();

  const [isCreateChirpModalOpen, setIsCreateChirpModalOpen] = useState<boolean>(
    dialog === 'create-chirp',
  );
  const [replyTo, setReplyTo] = useState<Chirp | null>(null);

  useEffect(() => {
    setIsCreateChirpModalOpen(dialog === 'create-chirp');
  }, [dialog]);

  const openCreateChirpModal = (replyTo?: Chirp) => {
    if (replyTo) setReplyTo(replyTo);
    navigate({ search: (old) => ({ ...old, dialog: 'create-chirp' }) });
  };

  const closeCreateChirpModal = () => {
    setReplyTo(null);
    navigate({ search: (old) => ({ ...old, dialog: undefined }) });
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
