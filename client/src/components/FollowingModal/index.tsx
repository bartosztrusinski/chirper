import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useQuery } from '@tanstack/react-query';

interface Props {
  username: string;
  open: boolean;
  onClose: () => void;
}

const FollowingModal = ({ username, open, onClose }: Props) => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', 'liking', username], () =>
    UserService.getManyFollowing(username),
  );

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
    <Modal title='Following' open={open} onClose={onClose}>
      <UserList users={users.data} />
    </Modal>
  );
};

export default FollowingModal;
