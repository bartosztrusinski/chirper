import styles from './CreateChirpModal.module.scss';
import CreateChirpForm from '../CreateChirpForm';
import Heading from '../../../../components/ui/Heading';
import Line from '../../../../components/ui/Line';
import Chirp from '../Chirp';
import Modal, { ModalProps } from '../../../../components/ui/Modal';
import { useModal } from '../../../../context/ModalContext';

const CreateChirpModal = (props: ModalProps) => {
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
