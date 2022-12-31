import styles from './styles.module.scss';
import Prompt from '.';
import Modal from '../Modal';
import { HiUserAdd as FollowIcon } from '@react-icons/all-files/hi/HiUserAdd';

interface FollowPromptModalProps extends ReactModal.Props {
  username: string;
}

const FollowPromptModal = ({
  username,
  ...restProps
}: FollowPromptModalProps) => {
  return (
    <Modal {...restProps} header={<FollowIcon className={styles.icon} />}>
      <Prompt
        title={`Follow ${username} to see what they share on Chirper`}
        description='Sign Up so you never miss their Chirps.'
      />
    </Modal>
  );
};

export default FollowPromptModal;
