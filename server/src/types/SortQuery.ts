import { SortValues } from 'mongoose';

interface SortQuery {
  [key: string]: SortValues | { $meta: 'textScore' };
}

export default SortQuery;
