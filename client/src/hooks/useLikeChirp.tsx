import IChirp from '../interfaces/Chirp';
import ChirpService from '../api/services/Chirp';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLikeChirp = (queryKeys: string[]) => {
  const queryClient = useQueryClient();
  const SERVER_ERROR = 'There was an error contacting the server';

  const { mutate: likeChirp } = useMutation(
    (likedChirpId: string) => ChirpService.likeChirp(likedChirpId),
    {
      onMutate: (likedChirpId: string) => {
        queryClient.cancelQueries(['chirps', ...queryKeys]);
        queryClient.cancelQueries(['likedChirpIds', ...queryKeys]);

        const chirpsSnapshot = queryClient.getQueryData<IChirp | IChirp[]>([
          'chirps',
          ...queryKeys,
        ]);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            Array.isArray(chirpsSnapshot)
              ? chirpsSnapshot.map((chirp) =>
                  chirp._id === likedChirpId
                    ? {
                        ...chirp,
                        metrics: {
                          ...chirp.metrics,
                          likeCount: chirp.metrics.likeCount + 1,
                        },
                      }
                    : chirp,
                )
              : {
                  ...chirpsSnapshot,
                  metrics: {
                    ...chirpsSnapshot.metrics,
                    likeCount: chirpsSnapshot.metrics.likeCount + 1,
                  },
                },
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>([
          'likedChirpIds',
          ...queryKeys,
        ]);

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
            [...likedChirpIdsSnapshot, likedChirpId],
          );
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
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            context.chirpsSnapshot,
          );
        }

        if (context?.likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
            context.likedChirpIdsSnapshot,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['chirps', ...queryKeys]);
        queryClient.invalidateQueries(['likedChirpIds', ...queryKeys]);
      },
    },
  );

  const { mutate: unlikeChirp } = useMutation(
    (unlikedChirpId: string) => ChirpService.unlikeChirp(unlikedChirpId),
    {
      onMutate: (unlikedChirpId: string) => {
        queryClient.cancelQueries(['chirps', ...queryKeys]);
        queryClient.cancelQueries(['likedChirpIds', ...queryKeys]);

        const chirpsSnapshot = queryClient.getQueryData<IChirp | IChirp[]>([
          'chirps',
          ...queryKeys,
        ]);

        if (chirpsSnapshot) {
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            Array.isArray(chirpsSnapshot)
              ? chirpsSnapshot.map((chirp) =>
                  chirp._id === unlikedChirpId
                    ? {
                        ...chirp,
                        metrics: {
                          ...chirp.metrics,
                          likeCount: chirp.metrics.likeCount - 1,
                        },
                      }
                    : chirp,
                )
              : {
                  ...chirpsSnapshot,
                  metrics: {
                    ...chirpsSnapshot.metrics,
                    likeCount: chirpsSnapshot.metrics.likeCount - 1,
                  },
                },
          );
        }

        const likedChirpIdsSnapshot = queryClient.getQueryData<string[]>([
          'likedChirpIds',
          ...queryKeys,
        ]);

        if (likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
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
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            context.chirpsSnapshot,
          );
        }

        if (context?.likedChirpIdsSnapshot) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
            context.likedChirpIdsSnapshot,
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(['chirps', ...queryKeys]);
        queryClient.invalidateQueries(['likedChirpIds', ...queryKeys]);
      },
    },
  );

  return { likeChirp, unlikeChirp };
};

export default useLikeChirp;
