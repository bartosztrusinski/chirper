import styles from './Toaster.module.scss';
import ToastBar from '../ToastBar';
import { useCurrentUser } from '../../../features/users';
import { Toaster as ReactHotToaster, ToasterProps } from 'react-hot-toast';

const Toaster = (props: ToasterProps) => {
  const { currentUser } = useCurrentUser();
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
