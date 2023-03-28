import UserLikedChirps from '../UserLikedChirps';
import { UserLocationGenerics } from '../../../users';
import { useMatch } from '@tanstack/react-location';

const LikedChirpsPanel = () => {
  const { params } = useMatch<UserLocationGenerics>();

  return <UserLikedChirps username={params.username} />;
};

export default LikedChirpsPanel;
