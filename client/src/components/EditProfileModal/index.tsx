import { useRef, useState } from 'react';
import useAutosizeTextArea from '../../hooks/useAutosizeTextarea';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import Textarea from '../Textarea';
import styles from './styles.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: Props) => {
  const [bio, setBio] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textareaRef.current, bio);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <Modal open={open} onClose={onClose} title='Edit profile'>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input placeholder='Name' required />
        <Textarea
          placeholder='Bio'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Input placeholder='Location' />
        <Input placeholder='Website' />
        <Button type='submit'>Save</Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
