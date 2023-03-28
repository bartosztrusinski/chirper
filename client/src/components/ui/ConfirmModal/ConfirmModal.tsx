import Button from '../Button';
import Modal, { ModalProps } from '../Modal';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps extends ModalProps {
  heading: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
}

const ConfirmModal = ({
  heading,
  description,
  confirmText,
  onConfirm,
  onRequestClose,
  ...restProps
}: ConfirmModalProps) => {
  return (
    <Modal
      {...restProps}
      onRequestClose={onRequestClose}
      className={styles.modal}
    >
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
          onClick={onRequestClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
