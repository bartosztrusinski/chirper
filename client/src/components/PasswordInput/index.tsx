import Input from '../Input';
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import { BiShow as ShowIcon } from '@react-icons/all-files/bi/BiShow';
import { BiHide as HideIcon } from '@react-icons/all-files/bi/BiHide';

interface PasswordInputProps extends ComponentPropsWithoutRef<'input'> {
  placeholder?: string;
  placeholderClassName?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { placeholder = 'Password', placeholderClassName, ...restProps },
    ref,
  ) {
    const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

    const togglePasswordReveal = () => {
      setIsPasswordRevealed((prev) => !prev);
    };

    return (
      <Input
        ref={ref}
        type={isPasswordRevealed ? 'text' : 'password'}
        placeholder={placeholder}
        placeholderClassName={placeholderClassName}
        button={isPasswordRevealed ? <HideIcon /> : <ShowIcon />}
        onButtonClick={togglePasswordReveal}
        {...restProps}
      />
    );
  },
);

export default PasswordInput;
