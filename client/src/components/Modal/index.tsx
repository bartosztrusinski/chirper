import styles from './styles.module.scss';
import ReactModal from 'react-modal';
import useLockScroll from '../../hooks/useLockScroll';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';

interface ModalProps extends ReactModal.Props {
  isOpen: boolean;
  title?: string;
  hasCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onRequestClose,
  children,
  title,
  hasCloseButton = true,
  ...restProps
}: ModalProps) => {
  const { lockScroll, clearLocks } = useLockScroll();
  const classes = [styles.modal, restProps.className].join(' ');

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterClose={() => clearLocks()}
      // preventScroll={true}
      contentRef={(ref) => lockScroll(ref)}
      className={classes}
      overlayClassName={styles.overlay}
    >
      <div className={styles.panel}>
        {title ? (
          <div className={styles.title}>{title}</div>
        ) : (
          <ChirperIcon className={styles.icon} />
        )}
        {hasCloseButton && (
          <button
            type='button'
            onClick={onRequestClose}
            className={styles.closeButton}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </ReactModal>
  );
};

export default Modal;
