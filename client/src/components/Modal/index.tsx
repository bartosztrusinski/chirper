import { useEffect, useRef, ReactNode, ComponentPropsWithoutRef } from 'react';
import styles from './styles.module.scss';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import useLockScroll from '../../hooks/useLockScroll';

interface Props extends ComponentPropsWithoutRef<'dialog'> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  hasCloseButton?: boolean;
  closeOnCancel?: boolean;
}

const Modal = ({
  open,
  onClose,
  children,
  title,
  hasCloseButton = true,
  closeOnCancel = true,
  ...restProps
}: Props) => {
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

    if (closeOnCancel) {
      onClose();
    }
  };

  const classes = [styles.dialog, restProps.className].join(' ');

  return (
    <dialog
      ref={dialogRef}
      onCancel={onCancel}
      onClose={onClose}
      {...restProps}
      className={classes}
    >
      <div className={styles.content}>{children}</div>
      <div className={styles.panel}>
        {title ? (
          <div className={styles.title}>{title}</div>
        ) : (
          <ChirperIcon className={styles.icon} />
        )}
        {hasCloseButton && (
          <button
            type='button'
            onClick={onClose}
            className={styles.closeButton}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
