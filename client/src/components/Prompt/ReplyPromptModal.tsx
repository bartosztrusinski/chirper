import styles from './styles.module.scss';
import Prompt from '.';
import Modal from '../Modal';
import { FaRegCommentAlt as ReplyIcon } from '@react-icons/all-files/fa/FaRegCommentAlt';

interface ReplyPromptModalProps extends ReactModal.Props {
  username: string;
}

const ReplyPromptModal = ({
  username,
  ...restProps
}: ReplyPromptModalProps) => {
  return (
    <Modal {...restProps} header={<ReplyIcon className={styles.icon} />}>
      <Prompt
        title='Reply to join the conversation'
        description={`Once you join Chirper, you can respond to ${username}'s Chirp.`}
      />
    </Modal>
  );
};

export default ReplyPromptModal;
