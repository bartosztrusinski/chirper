import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import ChirpService from '../api/services/Chirp';
import Chirp from '../interfaces/Chirp';

interface UseManageChirp {
  createChirp: UseMutateFunction<Chirp['_id'], unknown, CreateChirp, unknown>;
  deleteChirp: UseMutateFunction<void, unknown, string, unknown>;
}

interface CreateChirp {
  content: Chirp['content'];
  parentChirpId?: Chirp['_id'];
}

const useManageChirp = (): UseManageChirp => {
  const queryClient = useQueryClient();

  const { mutate: createChirp } = useMutation(
    ['chirps', 'create'],
    ({ content, parentChirpId }: CreateChirp) =>
      ChirpService.createChirp(content, parentChirpId),
    { onSuccess: () => queryClient.invalidateQueries(['chirps']) },
  );

  const { mutate: deleteChirp } = useMutation(
    ['chirps', 'delete'],
    (chirpId: string) => ChirpService.deleteChirp(chirpId),
    { onSuccess: () => queryClient.invalidateQueries(['chirps']) },
  );

  return { createChirp, deleteChirp };
};

export default useManageChirp;
