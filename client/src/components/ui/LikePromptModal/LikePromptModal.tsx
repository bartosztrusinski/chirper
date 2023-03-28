import styles from './LikePromptModal.module.scss';
import Modal, { ModalProps } from '../Modal/Modal';
import Prompt from '../Prompt';
import { FaHeart as HeartIcon } from '@react-icons/all-files/fa/FaHeart';

interface LikePromptModalProps extends ModalProps {
  username: string;
}

const LikePromptModal = ({ username, ...restProps }: LikePromptModalProps) => {
  return (
    <Modal {...restProps} header={<HeartIcon className={styles.icon} />}>
      <Prompt
        title='Like a Chirp to share the love'
        description={`Join Chirper now and let ${username} know you like their Chirp.`}
      />
    </Modal>
  );
};

export default LikePromptModal;
