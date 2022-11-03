import Button from '../Button';
import styles from './styles.module.scss';
import { BiShow as ShowIcon } from '@react-icons/all-files/bi/BiShow';
import { BiHide as HideIcon } from '@react-icons/all-files/bi/BiHide';
import { useState } from 'react';
import { Link } from '@tanstack/react-location';

const LoginForm = () => {
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const togglePasswordReveal = () => {
    setIsPasswordRevealed((prev) => !prev);
  };

  return (
    <>
      <div className={styles.heading}>Sign in to Chirper</div>
      <form className={styles.form}>
        <label className={styles.inputContainer}>
          <input type='text' className={styles.input} required autoFocus />
          <div className={styles.placeholder}>Username or email</div>
        </label>
        <label className={styles.inputContainer}>
          <input
            type={isPasswordRevealed ? 'text' : 'password'}
            className={styles.input}
            required
          />
          <div className={styles.placeholder}>Password</div>
          <button
            type='button'
            className={styles.revealPassword}
            onClick={togglePasswordReveal}
          >
            {isPasswordRevealed ? <HideIcon /> : <ShowIcon />}
          </button>
        </label>
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
