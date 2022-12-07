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
      title={
        replyTo ? `Replying to ${replyTo.author.profile.name}` : 'Create Chirp'
      }
      {...props}
    >
      {replyTo && (
        <>
          <div className={styles.replyToChirp}>
            <Chirp chirp={replyTo} showMetrics={false} onLike={() => null} />
          </div>
          <div className={styles.line}></div>
        </>
      )}
      <CreateChirpForm autoFocus replyToId={replyTo?._id} />
    </Modal>
  );
};

export default CreateChirpModal;
