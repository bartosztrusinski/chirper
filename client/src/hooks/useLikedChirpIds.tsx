import { useQuery } from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';

const useLikedChirpIds = (
  queryKeys: string[],
  userId: string,
  chirpIds: string[],
) =>
  useQuery(['likedChirpIds', ...queryKeys], () =>
    ChirpService.getLikedIds(userId, chirpIds),
  );

export default useLikedChirpIds;
