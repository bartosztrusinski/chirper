import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useQuery } from '@tanstack/react-query';

interface FollowingModalProps extends ReactModal.Props {
  username: string;
}

const FollowingModal = ({
  username,
  isOpen,
  onRequestClose,
}: FollowingModalProps) => {
  const queryKeys = [username, 'following'];

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', ...queryKeys], () =>
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
    <Modal title='Following' isOpen={isOpen} onRequestClose={onRequestClose}>
      <UserList users={users} queryKeys={queryKeys} />
    </Modal>
  );
};

export default FollowingModal;
