import IChirp from '../interfaces/Chirp';
import useUser from './useUser';
import ChirpService from '../api/services/Chirp';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const useLikeChirp = (queryKeys: unknown[]) => {
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  const chirpsQueryKeys = ['chirps', ...queryKeys];
  const currentUserLikedChirpsQueryKeys = [
    'chirps',
    currentUser?.username,
    'liked',
  ];

  const { mutate: likeChirp } = useMutation(
    (chirp: IChirp) => ChirpService.likeChirp(chirp._id),
    {
      onMutate: (chirp: IChirp) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(currentUserLikedChirpsQueryKeys);

        const likedChirp: IChirp = {
          ...chirp,
          isLiked: true,
          metrics: {
            ...chirp.metrics,
            likeCount: chirp.metrics.likeCount + 1,
          },
        };

        const chirpsSnapshot = queryClient.getQueryData<
          | IChirp
          | InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>
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
          InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>
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
        queryClient.invalidateQueries(['users', likedChirp._id, 'liking']);
      },
    },
  );

  const { mutate: unlikeChirp } = useMutation(
    (chirp: IChirp) => ChirpService.unlikeChirp(chirp._id),
    {
      onMutate: (chirp: IChirp) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(currentUserLikedChirpsQueryKeys);

        const unlikedChirp: IChirp = {
          ...chirp,
          isLiked: false,
          metrics: {
            ...chirp.metrics,
            likeCount: chirp.metrics.likeCount - 1,
          },
        };

        const chirpsSnapshot = queryClient.getQueryData<
          IChirp | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>
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
          InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>
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
        queryClient.invalidateQueries(['users', unlikedChirp._id, 'liking']);
      },
    },
  );

  return { likeChirp, unlikeChirp };
};

export default useLikeChirp;
