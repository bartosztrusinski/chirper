import UserChirpsWithReplies from '../UserChirpsWithReplies';
import { UserLocationGenerics } from '../../../users';
import { useMatch } from '@tanstack/react-location';

const CreatedChirpsWithRepliesPanel = () => {
  const { params } = useMatch<UserLocationGenerics>();

  return <UserChirpsWithReplies username={params.username} />;
};

export default CreatedChirpsWithRepliesPanel;
