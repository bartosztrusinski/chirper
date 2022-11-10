import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useQuery } from '@tanstack/react-query';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
}

const LikesModal = ({ id, open, onClose }: Props) => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', 'liking', id], () => UserService.getManyLiking(id));

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
    <Modal title='Liked by' open={open} onClose={onClose}>
      <UserList users={users.data} />
    </Modal>
  );
};

export default LikesModal;
