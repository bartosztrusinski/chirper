import { Chirp, CreateChirp } from '../interface';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import chirpKeys from '../queryKeys';
import { fetchCreateChirp, fetchDeleteChirp } from '../api';

type UseManageChirp = () => {
  createChirp: UseMutateFunction<Chirp['_id'], unknown, CreateChirp, unknown>;
  deleteChirp: UseMutateFunction<void, unknown, string, unknown>;
};

const useManageChirp: UseManageChirp = () => {
  const queryClient = useQueryClient();

  const { mutate: createChirp } = useMutation(
    chirpKeys.update('create'),
    fetchCreateChirp,
    { onSuccess: () => queryClient.invalidateQueries(chirpKeys.all()) },
  );

  const { mutate: deleteChirp } = useMutation(
    chirpKeys.update('delete'),
    fetchDeleteChirp,
    { onSuccess: () => queryClient.invalidateQueries(chirpKeys.all()) },
  );

  return { createChirp, deleteChirp };
};

export default useManageChirp;
