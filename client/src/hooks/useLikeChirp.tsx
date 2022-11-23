import IChirp from '../interfaces/Chirp';
import ChirpService from '../api/services/Chirp';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLikeChirp = (queryKeys: string[]) => {
  const queryClient = useQueryClient();
  const SERVER_ERROR = 'There was an error contacting the server';

  const { mutate: likeChirp } = useMutation(
    (chirpId: string) => ChirpService.likeChirp(chirpId),
    {
      onMutate: (chirpId: string) => {
        queryClient.cancelQueries(['chirps', ...queryKeys]);

        const previousChirps = queryClient.getQueryData<IChirp | IChirp[]>([
          'chirps',
          ...queryKeys,
        ]);

        const previousLikedChirpIds = queryClient.getQueryData<string[]>([
          'likedChirpIds',
          ...queryKeys,
        ]);

        queryClient.setQueryData(
          ['chirps', ...queryKeys],
          (old?: IChirp | IChirp[]) => {
            if (!old) return;

            if (!Array.isArray(old)) {
              return {
                ...old,
                metrics: {
                  ...old.metrics,
                  likeCount: old.metrics.likeCount + 1,
                },
              };
            }

            return old.map((chirp) => {
              if (chirp._id === chirpId) {
                return {
                  ...chirp,
                  metrics: {
                    ...chirp.metrics,
                    likeCount: chirp.metrics.likeCount + 1,
                  },
                };
              }

              return chirp;
            });
          },
        );

        queryClient.setQueryData(
          ['likedChirpIds', ...queryKeys],
          (old?: string[]) => {
            if (!old) return;

            return [...old, chirpId];
          },
        );

        return { previousChirps, previousLikedChirpIds };
      },
      onSuccess: () => {
        console.log('Chirp liked!');
      },
      onError: (error, data, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);
        if (context?.previousChirps) {
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            context.previousChirps,
          );
        }
        if (context?.previousLikedChirpIds) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
            context.previousLikedChirpIds,
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
    (chirpId: string) => ChirpService.unlikeChirp(chirpId),
    {
      onMutate: (chirpId: string) => {
        queryClient.cancelQueries(['chirps', ...queryKeys]);

        const previousChirps = queryClient.getQueryData<IChirp | IChirp[]>([
          'chirps',
          ...queryKeys,
        ]);

        const previousLikedChirpIds = queryClient.getQueryData<string[]>([
          'likedChirpIds',
          ...queryKeys,
        ]);

        queryClient.setQueryData(
          ['chirps', ...queryKeys],
          (old?: IChirp | IChirp[]) => {
            if (!old) return;

            if (!Array.isArray(old)) {
              return {
                ...old,
                metrics: {
                  ...old.metrics,
                  likeCount: old.metrics.likeCount - 1,
                },
              };
            }

            return old.map((chirp) => {
              if (chirp._id === chirpId) {
                return {
                  ...chirp,
                  metrics: {
                    ...chirp.metrics,
                    likeCount: chirp.metrics.likeCount - 1,
                  },
                };
              }

              return chirp;
            });
          },
        );

        queryClient.setQueryData(
          ['likedChirpIds', ...queryKeys],
          (old?: string[]) => {
            if (!old) return;

            return old.filter((id) => id !== chirpId);
          },
        );

        return { previousChirps, previousLikedChirpIds };
      },
      onSuccess: () => {
        console.log('Chirp unliked!');
      },
      onError: (error, data, context) => {
        const title =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;
        console.log(title);
        if (context?.previousChirps) {
          queryClient.setQueryData(
            ['chirps', ...queryKeys],
            context.previousChirps,
          );
        }
        if (context?.previousLikedChirpIds) {
          queryClient.setQueryData(
            ['likedChirpIds', ...queryKeys],
            context.previousLikedChirpIds,
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
