import IChirp from '../interfaces/Chirp';
import ChirpService from '../api/services/Chirp';
import axios from 'axios';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import useUser from './useUser';

const useLikeChirp = (queryKeys: unknown[], page?: number) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useUser();
  const SERVER_ERROR = 'There was an error contacting the server';

  const chirpsQueryKeys = ['chirps', ...queryKeys];
  const likedChirpIdsQueryKeys = ['likedChirpIds', ...queryKeys];
  const currentUserLikedChirpsQueryKeys = [
    'chirps',
    currentUser?.username,
    'liked',
  ];

  if (page !== undefined) {
    likedChirpIdsQueryKeys.push(page.toString());
  }

  const { mutate: likeChirp } = useMutation(
    (likedChirp: IChirp) => ChirpService.likeChirp(likedChirp._id),
    {
      onMutate: (likedChirp: IChirp) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(likedChirpIdsQueryKeys);

        const chirpsSnapshot = queryClient.getQueryData<
          | IChirp
          | InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>
        >(chirpsQueryKeys);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            chirpsQueryKeys,
            incrementLikedChirpMetrics(chirpsSnapshot, likedChirp._id),
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>(
          likedChirpIdsQueryKeys,
        );

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(likedChirpIdsQueryKeys, [
            ...likedChirpIdsSnapshot,
            likedChirp._id,
          ]);
        }

        const currentUserLikedChirpsSnapshot = queryClient.getQueryData<
          InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>
        >(currentUserLikedChirpsQueryKeys);

        if (currentUserLikedChirpsSnapshot) {
          queryClient.setQueryData(currentUserLikedChirpsQueryKeys, {
            ...currentUserLikedChirpsSnapshot,
            pages: currentUserLikedChirpsSnapshot.pages.map((page) => ({
              ...page,
              data: [likedChirp, ...page.data],
            })),
          });
        }

        return {
          chirpsSnapshot,
          likedChirpIdsSnapshot,
          currentUserLikedChirpsSnapshot,
        };
      },

      onSuccess: () => {
        console.log('Chirp liked!');
      },

      onError: (error, likedChirp, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.chirpsSnapshot) {
          queryClient.setQueryData(chirpsQueryKeys, context.chirpsSnapshot);
        }

        if (context?.likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            likedChirpIdsQueryKeys,
            context.likedChirpIdsSnapshot,
          );
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
        queryClient.invalidateQueries(likedChirpIdsQueryKeys);
        queryClient.invalidateQueries(currentUserLikedChirpsQueryKeys);
        queryClient.invalidateQueries(['users', likedChirp._id, 'liking']);
      },
    },
  );

  const { mutate: unlikeChirp } = useMutation(
    (unlikedChirp: IChirp) => ChirpService.unlikeChirp(unlikedChirp._id),
    {
      onMutate: (unlikedChirp: IChirp) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(likedChirpIdsQueryKeys);

        const chirpsSnapshot = queryClient.getQueryData<
          IChirp | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>
        >(chirpsQueryKeys);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            chirpsQueryKeys,
            decrementLikedChirpMetrics(chirpsSnapshot, unlikedChirp._id),
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>(
          likedChirpIdsQueryKeys,
        );

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            likedChirpIdsQueryKeys,
            likedChirpIdsSnapshot.filter(
              (likedChirpId) => likedChirpId !== unlikedChirp._id,
            ),
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
              data: page.data.filter(
                (likedChirp) => likedChirp._id !== unlikedChirp._id,
              ),
            })),
          });
        }

        return {
          chirpsSnapshot,
          likedChirpIdsSnapshot,
          currentUserLikedChirpsSnapshot,
        };
      },

      onSuccess: () => {
        console.log('Chirp unliked!');
      },

      onError: (error, unlikedChirp, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);

        if (context?.chirpsSnapshot) {
          queryClient.setQueryData(chirpsQueryKeys, context.chirpsSnapshot);
        }

        if (context?.likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            likedChirpIdsQueryKeys,
            context.likedChirpIdsSnapshot,
          );
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
        queryClient.invalidateQueries(likedChirpIdsQueryKeys);
        queryClient.invalidateQueries(['users', unlikedChirp._id, 'liking']);
      },
    },
  );

  return { likeChirp, unlikeChirp };
};

const changeQueryDataLikes = (
  chirpsData:
    | IChirp
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>,
  chirpId: string,
  delta: number,
) => {
  if ('pages' in chirpsData) {
    return {
      ...chirpsData,
      pages: chirpsData.pages.map((page) => ({
        ...page,
        data: page.data.map((chirp) => {
          if (chirpId === chirp._id) {
            return {
              ...chirp,
              metrics: {
                ...chirp.metrics,
                likeCount: chirp.metrics.likeCount + delta,
              },
            };
          }

          return chirp;
        }),
      })),
    };
  }

  return {
    ...chirpsData,
    metrics: {
      ...chirpsData.metrics,
      likeCount: chirpsData.metrics.likeCount + delta,
    },
  };
};

const incrementLikedChirpMetrics = (
  chirpsData:
    | IChirp
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>,
  likedChirpId: string,
) => changeQueryDataLikes(chirpsData, likedChirpId, 1);

const decrementLikedChirpMetrics = (
  chirpsData:
    | IChirp
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage?: string } }>,
  likedChirpId: string,
) => changeQueryDataLikes(chirpsData, likedChirpId, -1);

export default useLikeChirp;
