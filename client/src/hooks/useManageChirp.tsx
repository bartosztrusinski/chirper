import { useMutation, useQueryClient } from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';

interface CreateChirp {
  content: string;
  parentChirpId?: string;
}

const useManageChirp = () => {
  const queryClient = useQueryClient();

  const { mutate: createChirp, isLoading: isCreatingChirp } = useMutation(
    ({ content, parentChirpId }: CreateChirp) =>
      parentChirpId
        ? ChirpService.createReplyChirp(content, parentChirpId)
        : ChirpService.createChirp(content),

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

  return {
    createChirp,
    isCreatingChirp,
    deleteChirp,
  };
};

export default useManageChirp;
