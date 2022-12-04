import { useMutation, useQueryClient } from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';

interface CreateReply {
  newChirpContent: string;
  parentChirpId: string;
}

const useManageChirp = () => {
  const queryClient = useQueryClient();

  const { mutate: createChirp } = useMutation(
    (newChirpContent: string) => ChirpService.createChirp(newChirpContent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chirps']);
      },
      onError: () => {
        console.log('error creating chirp');
      },
    },
  );

  const { mutate: createReply } = useMutation(
    ({ newChirpContent, parentChirpId }: CreateReply) =>
      ChirpService.createReply(newChirpContent, parentChirpId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chirps']);
      },
      onError: () => {
        console.log('error creating reply');
      },
    },
  );

  const { mutate: deleteChirp } = useMutation(
    (chirpId: string) => ChirpService.deleteChirp(chirpId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chirps']);
      },
      onError: () => {
        console.log('error deleting chirp');
      },
    },
  );

  return { createChirp, createReply, deleteChirp };
};

export default useManageChirp;
