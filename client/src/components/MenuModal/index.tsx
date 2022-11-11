import Modal from '../Modal';
import Nav from '../Nav';
import UserPanel from '../UserPanel';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MenuModal = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.container}>
        <UserPanel />
        <Nav />
      </div>
    </Modal>
  );
};

export default MenuModal;
