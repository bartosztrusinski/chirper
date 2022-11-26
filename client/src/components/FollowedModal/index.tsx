import Modal from '../Modal';
import UserList from '../UserList';
import UserService from '../../api/services/User';
import { useQuery } from '@tanstack/react-query';

interface FollowedModalProps extends ReactModal.Props {
  username: string;
}

const FollowedModal = ({
  username,
  isOpen,
  onRequestClose,
}: FollowedModalProps) => {
  const queryKeys = [username, 'followed'];

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery(['users', ...queryKeys], () =>
    UserService.getManyFollowed(username),
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
    <Modal title='Followed' isOpen={isOpen} onRequestClose={onRequestClose}>
      <UserList users={users} queryKeys={queryKeys} />
    </Modal>
  );
};

export default FollowedModal;
