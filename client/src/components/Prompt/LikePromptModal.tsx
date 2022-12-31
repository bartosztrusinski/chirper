import styles from './styles.module.scss';
import Prompt from '.';
import Modal from '../Modal';
import { FaHeart as HeartIcon } from '@react-icons/all-files/fa/FaHeart';
import ReactModal from 'react-modal';

interface LikePromptModalProps extends ReactModal.Props {
  username: string;
}

const LikePromptModal = ({ username, ...restProps }: LikePromptModalProps) => {
  return (
    <Modal
      {...restProps}
      header={<HeartIcon className={`${styles.icon} ${styles.like}`} />}
    >
      <Prompt
        title='Like a Chirp to share the love'
        description={`Join Chirper now and let ${username} know you like their Chirp.`}
      />
    </Modal>
  );
};

export default LikePromptModal;
