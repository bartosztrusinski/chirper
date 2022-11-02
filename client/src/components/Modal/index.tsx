import React, { useEffect, useRef, ReactNode } from 'react';
import styles from './styles.module.scss';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import useLockScroll from '../../hooks/useLockScroll';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, onClose, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [lockScroll, unlockScroll, clearLocks] = useLockScroll();

  useEffect(() => {
    const dialog = dialogRef.current as HTMLDialogElement;

    if (open) {
      dialog?.showModal();
      lockScroll(dialog);
    } else {
      dialog?.close();
      unlockScroll(dialog);
    }

    return clearLocks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCancel = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      onClose={onClose}
      className={styles.dialog}
    >
      <button type='button' onClick={onClose} className={styles.closeButton}>
        <CloseIcon />
      </button>
      <div>{children}</div>
    </dialog>
  );
};

export default Modal;
