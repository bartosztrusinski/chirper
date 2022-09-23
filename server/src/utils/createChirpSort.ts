import { ChirpSortOrder } from '../types/chirp';
import SortQuery from '../types/SortQuery';

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
