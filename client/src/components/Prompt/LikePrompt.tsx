import { FaHeart as HeartIcon } from '@react-icons/all-files/fa/FaHeart';
import Prompt from '.';

interface Props {
  username: string;
}

const LikePrompt = ({ username }: Props) => {
  return (
    <Prompt
      title='Like a Chirp to share the love'
      description={`Join Chirper now and let ${username} know you like their Chirp.`}
      Icon={HeartIcon}
      iconColor='var(--color-like)'
    />
  );
};

export default LikePrompt;
