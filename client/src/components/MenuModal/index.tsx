import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import Modal from '../Modal';
import Nav from '../Nav';
import DarkModeToggle from '../Toggle/DarkModeToggle';
import UserPanel from '../UserPanel';
import styles from './styles.module.scss';

type MenuModalProps = ReactModal.Props;

const MenuModal = (props: MenuModalProps) => {
  const { currentUser } = useUser();
  const { logOut } = useAuth();

  return (
    <Modal {...props}>
      <UserPanel />

      <div className={styles.themePanel}>
        Theme
        <DarkModeToggle />
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
