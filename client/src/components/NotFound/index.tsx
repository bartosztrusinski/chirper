import { useNavigate } from '@tanstack/react-location';
import Button from '../Button';
import styles from './styles.module.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Hmm... this page doesn&apos;t exist</div>
      <div className={styles.description}>Try searching for something else</div>
      <Button
        className={styles.button}
        onClick={() => navigate({ to: '/search', search: true })}
      >
        Search
      </Button>
    </div>
  );
};

export default NotFound;
