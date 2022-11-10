import Input from '../Input';
import { ComponentPropsWithoutRef, useState } from 'react';
import { BiShow as ShowIcon } from '@react-icons/all-files/bi/BiShow';
import { BiHide as HideIcon } from '@react-icons/all-files/bi/BiHide';

interface Props extends ComponentPropsWithoutRef<'input'> {
  placeholder?: string;
}

const PasswordInput = ({ placeholder = 'Password', ...restProps }: Props) => {
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const togglePasswordReveal = () => {
    setIsPasswordRevealed((prev) => !prev);
  };

  return (
    <Input
      placeholder={placeholder}
      type={isPasswordRevealed ? 'text' : 'password'}
      button={isPasswordRevealed ? <HideIcon /> : <ShowIcon />}
      onButtonClick={togglePasswordReveal}
      {...restProps}
    />
  );
};

export default PasswordInput;
