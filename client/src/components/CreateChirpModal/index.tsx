import styles from './styles.module.scss';
import Modal from '../Modal';
import Chirp from '../Chirp';
import CreateChirpForm from '../CreateChirpForm';
import Line from '../Line';
import Heading from '../Heading';
import { useModal } from '../ModalProvider';

type CreateChirpModalProps = ReactModal.Props;

const CreateChirpModal = (props: CreateChirpModalProps) => {
  const modal = useModal();

  return (
    <Modal
      {...props}
      header={
        <Heading size='medium'>
          <h1>{modal.replyTo ? 'Reply to' : 'Create Chirp'}</h1>
        </Heading>
      }
    >
      {modal.replyTo && (
        <>
          <Chirp chirp={modal.replyTo} showMetrics={false} queryKeys={[]} />
          <Line bold className={styles.line} />
        </>
      )}
      <CreateChirpForm autoFocus replyToId={modal.replyTo?._id} />
    </Modal>
  );
};

export default CreateChirpModal;
