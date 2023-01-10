import styles from './styles.module.scss';
import ReactModal from 'react-modal';
import { IoMdClose as CloseIcon } from '@react-icons/all-files/io/IoMdClose';
import { RiTwitterLine as ChirperIcon } from '@react-icons/all-files/ri/RiTwitterLine';
import { ReactNode, useEffect, useRef } from 'react';
import {
  enableBodyScroll,
  disableBodyScroll,
} from '../../utils/lockBodyScroll';

interface ModalProps extends ReactModal.Props {
  header?: ReactNode;
  hasCloseButton?: boolean;
  contentClassName?: string;
}

const Modal = ({
  header,
  hasCloseButton = true,
  children,
  isOpen,
  onAfterOpen,
  onAfterClose,
  onRequestClose,
  className,
  contentClassName,
  ...restProps
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const modalClasses = [className, styles.modal].filter(Boolean).join(' ');
  const contentClasses = [contentClassName, styles.content]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    return () => enableBodyScroll(contentRef.current);
  }, [isOpen]);

  return (
    <ReactModal
      {...restProps}
      closeTimeoutMS={150}
      contentRef={(element) => (contentRef.current = element)}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterOpen={() => {
        disableBodyScroll(contentRef.current, { reserveScrollBarGap: true });
        onAfterOpen?.();
      }}
      onAfterClose={() => {
        enableBodyScroll(contentRef.current);
        onAfterClose?.();
      }}
      className={modalClasses}
      overlayClassName={styles.overlay}
      aria={{ labelledby: 'Chirper Modal' }}
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
