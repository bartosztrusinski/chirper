import { FaRegCommentAlt as ReplyIcon } from '@react-icons/all-files/fa/FaRegCommentAlt';
import Prompt from '.';

interface Props {
  username: string;
}

const ReplyPrompt = ({ username }: Props) => {
  return (
    <Prompt
      title='Reply to join the conversation'
      description={`Once you join Chirper, you can respond to ${username}'s Chirp.`}
      Icon={ReplyIcon}
    />
  );
};

export default ReplyPrompt;
