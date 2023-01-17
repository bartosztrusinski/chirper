import styles from './styles.module.scss';
import useUser from '../../hooks/useUser';
import ToastBar from './ToastBar';
import { Toaster as ReactHotToaster, ToasterProps } from 'react-hot-toast';

const Toaster = (props: ToasterProps) => {
  const { currentUser } = useUser();
  const duration = 3000;

  return (
    <ReactHotToaster
      containerClassName={`${styles.container} ${
        currentUser ? '' : styles.space
      }`}
      toastOptions={{
        duration,
        success: {
          position: 'bottom-center',
          className: styles.success,
          iconTheme: {
            primary: 'var(--toast-color)',
            secondary: 'var(--toast-success-color)',
          },
        },
        error: {
          position: 'top-center',
          className: styles.error,
          iconTheme: {
            primary: 'var(--toast-color)',
            secondary: 'var(--toast-error-color)',
          },
        },
      }}
      {...props}
    >
      {(t) => <ToastBar t={t} duration={duration} />}
    </ReactHotToaster>
  );
};

export default Toaster;
