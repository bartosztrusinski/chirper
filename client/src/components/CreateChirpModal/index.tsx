import styles from './styles.module.scss';
import Modal from '../Modal';
import Chirp from '../Chirp';
import CreateChirpForm from '../CreateChirpForm';
import { useContext } from 'react';
import { CreateChirpContext } from '../AuthenticatedApp';

type CreateChirpModalProps = ReactModal.Props;

const CreateChirpModal = (props: CreateChirpModalProps) => {
  const { replyTo } = useContext(CreateChirpContext) as CreateChirpContext;

  return (
    <Modal
      {...props}
      header={
        <h1 className={styles.heading}>
          {replyTo ? 'Reply to' : 'Create Chirp'}
        </h1>
      }
    >
      {replyTo && (
        <>
          <Chirp chirp={replyTo} showMetrics={false} queryKeys={[]} />
          <div className={styles.line}></div>
        </>
      )}
      <CreateChirpForm autoFocus replyToId={replyTo?._id} />
    </Modal>
  );
};

export default CreateChirpModal;
