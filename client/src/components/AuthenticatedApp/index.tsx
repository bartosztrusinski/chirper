import { Outlet, useNavigate, useSearch } from '@tanstack/react-location';
import { createContext, useEffect, useState } from 'react';
import Chirp from '../../interfaces/Chirp';
import CreateChirpModal from '../CreateChirpModal';

interface CreateChirpContext {
  replyTo: Chirp | null;
  openCreateChirpModal: (replyTo?: Chirp) => void;
  closeCreateChirpModal: () => void;
}

const CreateChirpContext = createContext<CreateChirpContext | null>(null);

const AuthenticatedApp = () => {
  const search = useSearch();
  const navigate = useNavigate();

  const [isCreateChirpModalOpen, setIsCreateChirpModalOpen] =
    useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<Chirp | null>(null);

  useEffect(() => {
    setIsCreateChirpModalOpen(search['create-chirp'] === true);
  }, [search]);

  const openCreateChirpModal = (replyTo?: Chirp) => {
    if (replyTo) setReplyTo(replyTo);
    navigate({ search: (old) => ({ ...old, 'create-chirp': true }) });
  };

  const closeCreateChirpModal = () => {
    setReplyTo(null);
    navigate({ search: (old) => ({ ...old, 'create-chirp': undefined }) });
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
