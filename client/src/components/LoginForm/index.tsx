import styles from './styles.module.scss';
import Input from '../Input';
import PasswordInput from '../PasswordInput';
import Button from '../Button';
import { Link, useNavigate } from '@tanstack/react-location';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
  const { logIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logIn({ login, password });
    navigate({ to: '/home' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'login') setLogin(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.heading}>Sign in to Chirper</div>
        <Input
          placeholder='Username or email'
          autoFocus
          required
          name='login'
          value={login}
          onChange={handleChange}
        />
        <PasswordInput
          required
          name='password'
          value={password}
          onChange={handleChange}
        />
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
