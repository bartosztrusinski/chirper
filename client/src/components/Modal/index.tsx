import styles from './styles.module.scss';
import ReactModal from 'react-modal';
import useLockScroll from '../../hooks/useLockScroll';
import { IoMdClose as CloseIcon } from '@react-icons/all-files/io/IoMdClose';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps extends ReactModal.Props {
  header?: ReactNode;
  hasCloseButton?: boolean;
  contentClassName?: string;
}

const Modal = ({
  header,
  hasCloseButton = true,
  children,
  onAfterOpen,
  onRequestClose,
  className,
  contentClassName,
  ...restProps
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { lockScroll, unlockScroll } = useLockScroll();

  const modalClasses = [className, styles.modal].filter(Boolean).join(' ');
  const contentClasses = [contentClassName, styles.content]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    if (contentRef.current && restProps.isOpen) {
      lockScroll(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        unlockScroll(contentRef.current);
      }
    };
  });

  return (
    <ReactModal
      {...restProps}
      contentRef={(element) => (contentRef.current = element)}
      className={modalClasses}
      overlayClassName={styles.overlay}
      aria={{ labelledby: 'Chirper Modal' }}
      onRequestClose={onRequestClose}
      onAfterOpen={() => {
        lockScroll(contentRef.current as HTMLDivElement);
        onAfterOpen?.();
      }}
    >
      <div className={styles.topBar}>
        {header ?? <ChirperIcon className={styles.icon} />}
        {hasCloseButton && (
          <button
            type='button'
            className={styles.closeButton}
            onClick={onRequestClose}
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <div className={contentClasses}>{children}</div>
    </ReactModal>
  );
};

export default Modal;
