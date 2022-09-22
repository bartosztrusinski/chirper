import { SortValues } from 'mongoose';
import { SortOrder } from '../schemas/';

interface SortQuery {
  [key: string]: SortValues | { $meta: 'textScore' };
}

const createChirpSortQuery = (sortOrder: SortOrder) => {
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
