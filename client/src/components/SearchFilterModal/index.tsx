import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import Toggle from '../Toggle';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SearchFilterModal = ({ open, onClose }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <Modal open={open} onClose={onClose} title='Search'>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <div className={styles.heading}>Sort by</div>
          <div className={styles.selectContainer}>
            <select className={styles.select}>
              <option>Relevant</option>
              <option>Popular</option>
              <option>Latest</option>
            </select>
          </div>
        </div>
        <div>
          <div className={styles.heading}>Accounts</div>
          <Input placeholder='From these accounts' />
        </div>
        <div>
          <div className={styles.heading}>Filters</div>
          <div className={styles.toggleGroup}>
            <div className={styles.toggle}>
              <div>Replies included</div>
              <Toggle name='include replies' />
            </div>
            <div className={styles.toggle}>
              <div>Followed only</div>
              <Toggle name='followed only' />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.heading}>Dates</div>
          <div className={styles.dateGroup}>
            <Input placeholder='From' type='date' />
            <Input placeholder='To' type='date' />
          </div>
        </div>
        <Button type='submit' className={styles.submitButton}>
          Apply
        </Button>
      </form>
    </Modal>
  );
};

export default SearchFilterModal;
