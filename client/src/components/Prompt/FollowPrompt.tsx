import Prompt from '.';
import { HiUserAdd as FollowIcon } from '@react-icons/all-files/hi/HiUserAdd';

interface Props {
  username: string;
}

const FollowPrompt = ({ username }: Props) => {
  return (
    <Prompt
      title={`Follow ${username} to see what they share on Chirper`}
      description='Sign Up so you never miss their Chirps.'
      Icon={FollowIcon}
    />
  );
};

export default FollowPrompt;
