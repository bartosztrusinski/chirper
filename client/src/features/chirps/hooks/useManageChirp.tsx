import { Chirp } from '../interface';
import { privateClient } from '../../../apiClient';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import chirpKeys from '../queryKeys';

interface UseManageChirp {
  createChirp: UseMutateFunction<Chirp['_id'], unknown, CreateChirp, unknown>;
  deleteChirp: UseMutateFunction<void, unknown, string, unknown>;
}

interface CreateChirp {
  content: Chirp['content'];
  parentChirpId?: Chirp['_id'];
}

const fetchCreateChirp = async ({
  content,
  parentChirpId,
}: CreateChirp): Promise<Chirp['_id']> => {
  const { data } = await privateClient.post<{ data: Chirp['_id'] }>('/chirps', {
    content,
    parentId: parentChirpId,
  });

  return data.data;
};

const fetchDeleteChirp = async (chirpId: string) => {
  await privateClient.delete(`/chirps/${chirpId}`);
};

const useManageChirp = (): UseManageChirp => {
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
