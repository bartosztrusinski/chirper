import { FormEvent, useState } from 'react';
import useMultiStepForm from '../../hooks/useMultiStepForm';
import Button from '../Button';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import styles from './styles.module.scss';
import Input from '../Input';
import { Link } from '@tanstack/react-location';
import PasswordInput from '../PasswordInput';
import Modal from '../Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RegisterForm = ({ onClose, open }: Props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [generatedCode] = useState(Math.floor(Math.random() * 90000) + 10000);
  const [verificationCode, setVerificationCode] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [username, setUsername] = useState('');

  const emailForm = (
    <>
      <div className={styles.heading}>Create your account</div>
      <Input
        placeholder='Email'
        type='email'
        autoFocus
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        required
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </>
  );

  const verifyForm = (
    <>
      <div>
        <div className={styles.heading}>We sent you a code</div>
        <div className={styles.description}>
          Enter it below to verify {email}
        </div>
      </div>
      <Input
        placeholder='Verification code'
        autoFocus
        required
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
    </>
  );

  const passwordForm = (
    <>
      <div className={styles.heading}>You&apos;ll need a password</div>
      <PasswordInput
        autoFocus
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
        placeholder='Confirm password'
        required
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      <div className={styles.description}>
        Password must be at least 8 characters long and contain:
        <ul style={{ listStylePosition: 'inside' }}>
          <li>uppercase letter</li>
          <li>lowercase letter</li>
          <li>number</li>
        </ul>
      </div>
    </>
  );

  const usernameForm = (
    <>
      <div className={styles.heading}>What should we call you?</div>
      <div className={styles.description}>
        Your @username is unique. You can always change it later
      </div>
      <Input
        placeholder='Username'
        required
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </>
  );

  const { currentStepIndex, step, steps, isFirstStep, isLastStep, next, back } =
    useMultiStepForm([emailForm, verifyForm, passwordForm, usernameForm]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFirstStep) {
      // send verification code
      console.log(generatedCode);
    }

    if (currentStepIndex === 1) {
      // verify code
      if (verificationCode !== generatedCode.toString()) {
        console.log('Incorrect code');
        return;
      }
    }

    if (isLastStep) {
      console.log('submitting form');
    }

    next();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnCancel={isFirstStep}
      hasCloseButton={isFirstStep}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.stepContainer}>
          <div className={styles.stepIndexPanel}>
            {!isFirstStep && (
              <button
                type='button'
                onClick={back}
                className={styles.backButton}
              >
                <FaArrowLeft />
              </button>
            )}
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          {step}
        </div>
        <Button type='submit' className={styles.submitButton}>
          {isLastStep ? 'Create Account' : 'Next'}
        </Button>
        {isFirstStep && (
          <div className={styles.logInLink}>
            Have an account already? <Link to='/'>Log In</Link>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default RegisterForm;
