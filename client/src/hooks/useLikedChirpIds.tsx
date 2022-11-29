import { useQuery } from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';

const useLikedChirpIds = (
  queryKeys: string[],
  username: string,
  chirpIds: string[],
) =>
  useQuery(
    ['likedChirpIds', ...queryKeys],
    () => ChirpService.getLikedChirpIds(username, chirpIds),
    {
      enabled: !!chirpIds.length,
    },
  );

export default useLikedChirpIds;
