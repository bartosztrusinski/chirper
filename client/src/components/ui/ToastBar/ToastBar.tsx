import styles from './ToastBar.module.scss';
import { useEffect } from 'react';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import toast, {
  Toast as ToastBar,
  ToastBar as ReactHotToastBar,
} from 'react-hot-toast';

interface ToastProps {
  t: ToastBar;
  duration: number;
}

const ToastBar = ({ t, duration }: ToastProps) => {
  useEffect(() => {
    setTimeout(() => {
      toast.dismiss(t.id);
    }, duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReactHotToastBar toast={t}>
      {({ icon, message }) => (
        <>
          {icon}
          {message}
          {t.type !== 'loading' && (
            <button
              className={styles.closeButton}
              onClick={() => toast.dismiss(t.id)}
            >
              <CloseIcon />
            </button>
          )}
        </>
      )}
    </ReactHotToastBar>
  );
};

export default ToastBar;
