import { useCurrentUser, userKeys } from '../../users';
import { Chirp, ChirpsResponse } from '../interface';
import {
  InfiniteData,
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import chirpKeys from '../queryKeys';
import { fetchLikeChirp, fetchUnlikeChirp } from '../api';

type UseLikeChirp = (queryKeys: readonly unknown[]) => {
  likeChirp: UseMutateFunction<void, unknown, Chirp, unknown>;
  unlikeChirp: UseMutateFunction<void, unknown, Chirp, unknown>;
};

const useLikeChirp: UseLikeChirp = (queryKeys) => {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const chirpsQueryKeys = queryKeys;
  const currentUserLikedChirpsQueryKeys = currentUser
    ? chirpKeys.list('liked', currentUser.username)
    : [];

  const { mutate: likeChirp } = useMutation(fetchLikeChirp, {
    onMutate: (chirp: Chirp) => {
      queryClient.cancelQueries(chirpsQueryKeys);
      queryClient.cancelQueries(currentUserLikedChirpsQueryKeys);

      const likedChirp: Chirp = {
        ...chirp,
        isLiked: true,
        metrics: {
          ...chirp.metrics,
          likeCount: chirp.metrics.likeCount + 1,
        },
      };

      const chirpsSnapshot = queryClient.getQueryData<
        Chirp | InfiniteData<ChirpsResponse>
      >(chirpsQueryKeys);

      if (chirpsSnapshot) {
        queryClient.setQueryData(
          chirpsQueryKeys,
          'pages' in chirpsSnapshot
            ? {
                ...chirpsSnapshot,
                pages: chirpsSnapshot.pages.map((page) => ({
                  ...page,
                  data: page.data.map((chirp) =>
                    likedChirp._id === chirp._id ? likedChirp : chirp,
                  ),
                })),
              }
            : likedChirp,
        );
      }

      const currentUserLikedChirpsSnapshot = queryClient.getQueryData<
        InfiniteData<ChirpsResponse>
      >(currentUserLikedChirpsQueryKeys);

      if (currentUserLikedChirpsSnapshot) {
        queryClient.setQueryData(currentUserLikedChirpsQueryKeys, {
          ...currentUserLikedChirpsSnapshot,
          pages: [
            { data: [likedChirp] },
            ...currentUserLikedChirpsSnapshot.pages,
          ],
        });
      }

      return {
        chirpsSnapshot,
        currentUserLikedChirpsSnapshot,
      };
    },

    onError: (error, likedChirp, context) => {
      if (context?.chirpsSnapshot) {
        queryClient.setQueryData(chirpsQueryKeys, context.chirpsSnapshot);
      }

      if (context?.currentUserLikedChirpsSnapshot) {
        queryClient.setQueryData(
          currentUserLikedChirpsQueryKeys,
          context.currentUserLikedChirpsSnapshot,
        );
      }
    },

    onSettled: (data, error, likedChirp) => {
      queryClient.invalidateQueries(chirpsQueryKeys);
      queryClient.invalidateQueries(currentUserLikedChirpsQueryKeys);
      queryClient.invalidateQueries(userKeys.list('liking', likedChirp._id));
    },
  });

  const { mutate: unlikeChirp } = useMutation(fetchUnlikeChirp, {
    onMutate: (chirp: Chirp) => {
      queryClient.cancelQueries(chirpsQueryKeys);
      queryClient.cancelQueries(currentUserLikedChirpsQueryKeys);

      const unlikedChirp: Chirp = {
        ...chirp,
        isLiked: false,
        metrics: {
          ...chirp.metrics,
          likeCount: chirp.metrics.likeCount - 1,
        },
      };

      const chirpsSnapshot = queryClient.getQueryData<
        Chirp | InfiniteData<ChirpsResponse>
      >(chirpsQueryKeys);

      if (chirpsSnapshot) {
        queryClient.setQueryData(
          chirpsQueryKeys,
          'pages' in chirpsSnapshot
            ? {
                ...chirpsSnapshot,
                pages: chirpsSnapshot.pages.map((page) => ({
                  ...page,
                  data: page.data.map((chirp) =>
                    unlikedChirp._id === chirp._id ? unlikedChirp : chirp,
                  ),
                })),
              }
            : unlikedChirp,
        );
      }

      const currentUserLikedChirpsSnapshot = queryClient.getQueryData<
        InfiniteData<ChirpsResponse>
      >(currentUserLikedChirpsQueryKeys);

      if (currentUserLikedChirpsSnapshot) {
        queryClient.setQueryData(currentUserLikedChirpsQueryKeys, {
          ...currentUserLikedChirpsSnapshot,
          pages: currentUserLikedChirpsSnapshot.pages.map((page) => ({
            ...page,
            data: page.data.filter((chirp) => chirp._id !== unlikedChirp._id),
          })),
        });
      }

      return { chirpsSnapshot, currentUserLikedChirpsSnapshot };
    },

    onError: (error, unlikedChirp, context) => {
      if (context?.chirpsSnapshot) {
        queryClient.setQueryData(chirpsQueryKeys, context.chirpsSnapshot);
      }

      if (context?.currentUserLikedChirpsSnapshot) {
        queryClient.setQueryData(
          currentUserLikedChirpsQueryKeys,
          context.currentUserLikedChirpsSnapshot,
        );
      }
    },

    onSettled: (data, error, unlikedChirp) => {
      queryClient.invalidateQueries(chirpsQueryKeys);
      queryClient.invalidateQueries(currentUserLikedChirpsQueryKeys);
      queryClient.invalidateQueries(userKeys.list('liking', unlikedChirp._id));
    },
  });

  return { likeChirp, unlikeChirp };
};

export default useLikeChirp;
