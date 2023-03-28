import UserChirps from '../UserChirps';
import { UserLocationGenerics } from '../../../users';
import { useMatch } from '@tanstack/react-location';

const CreatedChirpsPanel = () => {
  const { params } = useMatch<UserLocationGenerics>();

  return <UserChirps username={params.username} />;
};

export default CreatedChirpsPanel;
