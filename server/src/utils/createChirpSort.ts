import { ChirpSortOrder } from '../api/chirps/chirp.interfaces.';
import { SortQuery } from '../interfaces/general';

const createChirpSortQuery = (sortOrder: ChirpSortOrder) => {
  const sortBy: Record<string, SortQuery> = {
    recent: { createdAt: -1 },
    popular: { 'metrics.likeCount': -1 },
    relevant: { score: { $meta: 'textScore' } },
  };
  const sortQuery: SortQuery = {
    ...sortBy[sortOrder],
    ...sortBy.relevant,
  };
  return sortQuery;
};

export default createChirpSortQuery;
