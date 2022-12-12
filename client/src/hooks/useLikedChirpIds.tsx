import { useQuery } from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';
import useUser from './useUser';

const useLikedChirpIds = (queryKeys: unknown[], chirpIds: string[]) => {
  const { user } = useUser();

  return useQuery(
    ['likedChirpIds', ...queryKeys],
    () => ChirpService.getLikedChirpIds(user!.username, chirpIds),
    { enabled: Boolean(chirpIds.length && user) },
  );
};

export default useLikedChirpIds;
