import { queryClient } from '../../context/QueryContext';
import { SearchParams } from '../../interface';
import { User, getStoredUser } from '../users';
import {
  fetchChirp,
  fetchChirps,
  fetchFeedChirps,
  fetchLikedChirpIds,
  fetchLikedChirps,
  fetchReplyChirps,
  fetchSearchChirps,
  fetchUserChirps,
  fetchUserChirpsWithReplies,
} from './api';
import { Chirp, ChirpsResponse } from './interface';
import chirpKeys from './queryKeys';

const loadChirp = (chirpId: Chirp['_id']) =>
  queryClient.getQueryData(chirpKeys.detail(chirpId)) ??
  queryClient.fetchQuery(chirpKeys.detail(chirpId), async () => {
    const currentUser = getStoredUser();
    const chirp = await fetchChirp(chirpId);

    if (!currentUser) {
      return chirp;
    }

    const likedChirpIds = await fetchLikedChirpIds(currentUser.username, [
      chirp._id,
    ]);

    return { ...chirp, isLiked: likedChirpIds.includes(chirp._id) };
  });

const loadChirpsData = (
  queryFn: () => Promise<ChirpsResponse>,
  queryKeys: readonly unknown[],
) =>
  queryClient.getQueryData(queryKeys) ??
  queryClient.fetchInfiniteQuery(queryKeys, async () => {
    const currentUser = getStoredUser();
    const { data, ...rest } = await queryFn();

    if (!currentUser || data.length === 0) {
      return { data, ...rest };
    }

    const likedChirpIds = await fetchLikedChirpIds(
      currentUser.username,
      data.map((chirp) => chirp._id),
    );

    return {
      data: data.map((chirp) => ({
        ...chirp,
        isLiked: likedChirpIds.includes(chirp._id),
      })),
      ...rest,
    };
  });

const loadAllChirps = () => loadChirpsData(fetchChirps, chirpKeys.list('all'));

const loadFeedChirps = () => {
  const user = getStoredUser();

  if (!user) return {};

  return loadChirpsData(
    () => fetchFeedChirps(user.username),
    chirpKeys.list('feed', user.username),
  );
};

const loadSearchChirps = (query: SearchParams['query']) => {
  if (!query) return {};

  return loadChirpsData(
    () => fetchSearchChirps({ query }),
    chirpKeys.list('search', { query }),
  );
};

const loadReplyChirps = (parentChirpId: Chirp['_id']) =>
  loadChirpsData(
    () => fetchReplyChirps(parentChirpId),
    chirpKeys.list('replies', parentChirpId),
  );

const loadUserChirps = (username: User['username']) =>
  loadChirpsData(
    () => fetchUserChirps(username),
    chirpKeys.list('noReplies', username),
  );

const loadUserChirpsWithReplies = (username: User['username']) =>
  loadChirpsData(
    () => fetchUserChirpsWithReplies(username),
    chirpKeys.list('withReplies', username),
  );

const loadLikedChirps = (username: User['username']) =>
  loadChirpsData(
    () => fetchLikedChirps(username),
    chirpKeys.list('liked', username),
  );

export {
  loadChirp,
  loadAllChirps,
  loadFeedChirps,
  loadSearchChirps,
  loadReplyChirps,
  loadUserChirps,
  loadUserChirpsWithReplies,
  loadLikedChirps,
};
