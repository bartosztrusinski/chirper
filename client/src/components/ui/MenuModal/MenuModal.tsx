import styles from './MenuModal.module.scss';
import toast from 'react-hot-toast';
import Button from '../Button';
import Modal, { ModalProps } from '../Modal';
import Nav from '../Nav';
import ThemeToggle from '../ThemeToggle';
import { AuthPanel, useAuth } from '../../../features/auth';
import { UserPanel, useCurrentUser } from '../../../features/users';

const MenuModal = (props: ModalProps) => {
  const { currentUser } = useCurrentUser();
  const { logOut } = useAuth();

  return (
    <Modal {...props}>
      {currentUser ? <UserPanel /> : <AuthPanel />}

      <div className={styles.themePanel}>
        Theme
        <ThemeToggle />
      </div>

      <Nav />

      {currentUser && (
        <Button
          className={styles.logOutButton}
          onClick={() => {
            logOut();
            toast.success('Logged out');
          }}
        >
          Log Out
        </Button>
      )}
    </Modal>
  );
};

export default MenuModal;
