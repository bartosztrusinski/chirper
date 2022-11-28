import IChirp from '../interfaces/Chirp';
import ChirpService from '../api/services/Chirp';
import axios from 'axios';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const changeQueryDataLikes = (
  chirpsData:
    | IChirp
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>,
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
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>,
  likedChirpId: string,
) => changeQueryDataLikes(chirpsData, likedChirpId, 1);

const decrementLikedChirpMetrics = (
  chirpsData:
    | IChirp
    | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>,
  likedChirpId: string,
) => changeQueryDataLikes(chirpsData, likedChirpId, -1);

const useLikeChirp = (queryKeys: string[], page: number) => {
  const queryClient = useQueryClient();
  const SERVER_ERROR = 'There was an error contacting the server';
  const chirpsQueryKeys = ['chirps', ...queryKeys];
  const likedChirpIdsQueryKeys = ['likedChirpIds', ...queryKeys, `${page}`];

  const { mutate: likeChirp } = useMutation(
    (likedChirpId: string) => ChirpService.likeChirp(likedChirpId),
    {
      onMutate: (likedChirpId: string) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(likedChirpIdsQueryKeys);

        const chirpsSnapshot = queryClient.getQueryData<
          IChirp | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>
        >(chirpsQueryKeys);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            chirpsQueryKeys,
            incrementLikedChirpMetrics(chirpsSnapshot, likedChirpId),
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>(
          likedChirpIdsQueryKeys,
        );

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(likedChirpIdsQueryKeys, [
            ...likedChirpIdsSnapshot,
            likedChirpId,
          ]);
        }

        return { chirpsSnapshot, likedChirpIdsSnapshot };
      },
      onSuccess: () => {
        console.log('Chirp liked!');
      },
      onError: (error, likedChirpId, context) => {
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
      },
      onSettled: () => {
        queryClient.invalidateQueries(chirpsQueryKeys);
        queryClient.invalidateQueries(likedChirpIdsQueryKeys);
      },
    },
  );

  const { mutate: unlikeChirp } = useMutation(
    (unlikedChirpId: string) => ChirpService.unlikeChirp(unlikedChirpId),
    {
      onMutate: (unlikedChirpId: string) => {
        queryClient.cancelQueries(chirpsQueryKeys);
        queryClient.cancelQueries(likedChirpIdsQueryKeys);

        const chirpsSnapshot = queryClient.getQueryData<
          IChirp | InfiniteData<{ data: IChirp[]; meta?: { nextPage: string } }>
        >(chirpsQueryKeys);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            chirpsQueryKeys,
            decrementLikedChirpMetrics(chirpsSnapshot, unlikedChirpId),
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>(
          likedChirpIdsQueryKeys,
        );

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            likedChirpIdsQueryKeys,
            likedChirpIdsSnapshot.filter((id) => id !== unlikedChirpId),
          );
        }

        return { chirpsSnapshot, likedChirpIdsSnapshot };
      },
      onSuccess: () => {
        console.log('Chirp unliked!');
      },
      onError: (error, unlikedChirpId, context) => {
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
      },
      onSettled: () => {
        queryClient.invalidateQueries(chirpsQueryKeys);
        queryClient.invalidateQueries(likedChirpIdsQueryKeys);
      },
    },
  );

  return { likeChirp, unlikeChirp };
};

export default useLikeChirp;
