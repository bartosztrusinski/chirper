import styles from './styles.module.scss';
import { RiCloseFill as CloseIcon } from '@react-icons/all-files/ri/RiCloseFill';
import toast, {
  ToastBar,
  Toaster as ReactHotToaster,
  ToasterProps,
} from 'react-hot-toast';
import useUser from '../../hooks/useUser';

const Toaster = (props: ToasterProps) => {
  const { user } = useUser();

  return (
    <ReactHotToaster
      position='bottom-center'
      containerClassName={`${styles.container} ${user ? '' : styles.space}`}
      toastOptions={{
        duration: 3000,
        success: {
          className: styles.success,
          iconTheme: {
            primary: 'var(--toast-color)',
            secondary: 'var(--toast-success-color)',
          },
        },
        error: {
          className: styles.error,
          iconTheme: {
            primary: 'var(--toast-color)',
            secondary: 'var(--toast-error-color)',
          },
        },
      }}
      {...props}
    >
      {(t) => (
        <ToastBar toast={t}>
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
        </ToastBar>
      )}
    </ReactHotToaster>
  );
};

export default Toaster;
