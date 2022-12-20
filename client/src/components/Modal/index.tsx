import styles from './styles.module.scss';
import ReactModal from 'react-modal';
// import useLockScroll from '../../hooks/useLockScroll';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
// import { useEffect, useRef } from 'react';

interface ModalProps extends ReactModal.Props {
  title?: string;
  hasCloseButton?: boolean;
  contentClassName?: string;
}

const Modal = ({
  title,
  hasCloseButton = true,
  children,
  onAfterOpen,
  onAfterClose,
  onRequestClose,
  className,
  contentClassName,
  ...restProps
}: ModalProps) => {
  // const { lockScroll, clearLocks, unlockScroll } = useLockScroll();
  // const contentRef = useRef<HTMLDivElement | null>(null);
  const modalClasses = [className, styles.modal].filter(Boolean).join(' ');
  const contentClasses = [contentClassName, styles.content]
    .filter(Boolean)
    .join(' ');

  // useEffect(() => {
  //   return () => clearLocks();
  // });

  return (
    <ReactModal
      onRequestClose={onRequestClose}
      onAfterOpen={() => {
        const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
        document.body.style.marginRight = `${scrollbarWidth}px`;
        document.body.style.overflowY = 'hidden';
        onAfterOpen?.();
      }}
      onAfterClose={() => {
        document.body.style.overflowY = 'unset';
        document.body.style.marginRight = 'unset';
        onAfterClose?.();
      }}
      // contentRef={(element) => (contentRef.current = element)}
      // onAfterClose={onAfterClose}
      // onAfterOpen={() => {
      //   lockScroll(contentRef.current as HTMLDivElement);
      //   onAfterOpen?.();
      // }}
      // onRequestClose={(e) => {
      //   unlockScroll(contentRef.current as HTMLDivElement);
      //   onRequestClose?.(e);
      // }}
      {...restProps}
      className={modalClasses}
      overlayClassName={styles.overlay}
      aria={{ labelledby: `${title ?? 'Chirper'} Modal` }}
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
      <div className={contentClasses}>{children}</div>
    </ReactModal>
  );
};

export default Modal;
