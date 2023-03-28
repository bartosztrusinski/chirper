import styles from './AuthBar.module.scss';
import Button from '../../../../components/ui/Button';
import useBreakpoint from '../../../../hooks/useBreakpoint';
import { useModal } from '../../../../context/ModalContext';

const AuthBar = () => {
  const isScreenMediumUp = useBreakpoint('up', 'medium');
  const modal = useModal();

  return (
    <div className={styles.bar}>
      {isScreenMediumUp && (
        <div>
          <div className={styles.mainText}>
            Don&apos;t miss what&apos;s happening
          </div>
          <div className={styles.subText}>
            People on Chirper are the first to know
          </div>
        </div>
      )}
      <Button variant='light' onClick={modal.openLogIn}>
        Log in
      </Button>
      <Button variant='light' onClick={modal.openSignUp}>
        Sign up
      </Button>
    </div>
  );
};

export default AuthBar;
