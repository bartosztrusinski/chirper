import Button from '../Button';
import Modal from '../Modal';
import styles from './styles.module.scss';

interface Props {
  heading: string;
  description: string;
  confirmText: string;

  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  heading,
  description,
  confirmText,
}: Props) => {
  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.heading}>{heading}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.buttons}>
        <Button
          variant='light'
          className={styles.confirmButton}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
        <Button
          variant='dark'
          className={styles.cancelButton}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
