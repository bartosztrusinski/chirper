import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useQuery } from '@tanstack/react-query';

interface LikesModalProps extends ReactModal.Props {
  id: string;
}

const LikesModal = ({ id, isOpen, onRequestClose }: LikesModalProps) => {
  const queryKeys = [id, 'liking'];

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', ...queryKeys], () => UserService.getManyLiking(id));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return (
      <p>
        Error:
        {error instanceof Error
          ? error.message
          : 'Oops, something went wrong...'}
      </p>
    );
  }

  return (
    <Modal title='Liked by' isOpen={isOpen} onRequestClose={onRequestClose}>
      <UserList users={users} queryKeys={queryKeys} />
    </Modal>
  );
};

export default LikesModal;
