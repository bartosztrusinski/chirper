import styles from './styles.module.scss';
import Modal from '../Modal';
import Chirp from '../Chirp';
import CreateChirpForm from '../CreateChirpForm';
import { useContext } from 'react';
import { CreateChirpContext } from '../AuthenticatedApp';
import Line from '../Line';
import Heading from '../Heading';

type CreateChirpModalProps = ReactModal.Props;

const CreateChirpModal = (props: CreateChirpModalProps) => {
  const { replyTo } = useContext(CreateChirpContext) as CreateChirpContext;

  return (
    <Modal
      {...props}
      header={
        <Heading size='medium'>
          <h1>{replyTo ? 'Reply to' : 'Create Chirp'}</h1>
        </Heading>
      }
    >
      {replyTo && (
        <>
          <Chirp chirp={replyTo} showMetrics={false} queryKeys={[]} />
          <Line bold className={styles.line} />
        </>
      )}
      <CreateChirpForm autoFocus replyToId={replyTo?._id} />
    </Modal>
  );
};

export default CreateChirpModal;
