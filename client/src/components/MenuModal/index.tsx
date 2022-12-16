import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import Button from '../Button';
import Modal from '../Modal';
import AuthenticatedNav from '../Nav/AuthenticatedNav';
import UnauthenticatedNav from '../Nav/UnauthenticatedNav';
import DarkModeToggle from '../Toggle/DarkModeToggle';
import UserPanel from '../UserPanel';
import styles from './styles.module.scss';

type MenuModalProps = ReactModal.Props;

const MenuModal = (props: MenuModalProps) => {
  const { user } = useUser();
  const { logOut } = useAuth();

  return (
    <Modal {...props}>
      <UserPanel />
      <div className={styles.themePanel}>
        Theme
        <DarkModeToggle />
      </div>
      {user ? (
        <>
          <AuthenticatedNav />
          <Button className={styles.logOutButton} onClick={() => logOut()}>
            Log Out
          </Button>
        </>
      ) : (
        <UnauthenticatedNav />
      )}
    </Modal>
  );
};

export default MenuModal;
