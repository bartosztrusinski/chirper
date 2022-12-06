import styles from './styles.module.scss';
import Modal from '../Modal';
import Chirp from '../Chirp';
import IChirp from '../../interfaces/Chirp';
import CreateChirpForm from '../CreateChirpForm';

interface CreateChirpModalProps extends ReactModal.Props {
  replyToChirp?: IChirp;
}

const CreateChirpModal = ({
  replyToChirp,
  onRequestClose,
  ...restProps
}: CreateChirpModalProps) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      title={
        replyToChirp
          ? `Replying to ${replyToChirp.author.profile.name}`
          : 'Create Chirp'
      }
      {...restProps}
    >
      {replyToChirp && (
        <>
          <div className={styles.replyToChirp}>
            <Chirp
              chirp={replyToChirp}
              showMetrics={false}
              onLike={() => null}
              onReply={() => null}
            />
          </div>
          <div className={styles.line}></div>
        </>
      )}
      <CreateChirpForm
        replyToId={replyToChirp?._id}
        autoFocus
        onCreate={onRequestClose}
      />
    </Modal>
  );
};

export default CreateChirpModal;
