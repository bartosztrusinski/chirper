import styles from './styles.module.scss';
import Input from '../Input';
import PasswordInput from '../PasswordInput';
import Button from '../Button';
import { Link } from '@tanstack/react-location';

const LoginForm = () => {
  return (
    <>
      <form className={styles.form}>
        <div className={styles.heading}>Sign in to Chirper</div>
        <Input placeholder='Username or email' />
        <PasswordInput />
        <Button type='submit' className={styles.submit}>
          Log In
        </Button>
      </form>
      <p>
        Don&apos;t have an account? <Link to='/'>Sign Up</Link>
      </p>
    </>
  );
};

export default LoginForm;
