import { SearchParams } from '../../interface';

type ListFilter =
  | 'replies'
  | 'noReplies'
  | 'withReplies'
  | 'liked'
  | 'feed'
  | 'search'
  | 'all';

type UpdateFilter = 'create' | 'delete';

const chirpKeys = {
  all: () => ['chirps'] as const,
  lists: () => [...chirpKeys.all(), 'list'] as const,
  list: (filter: ListFilter, id?: string | SearchParams) => {
    const keys = [...chirpKeys.lists(), filter] as const;

    if (id) {
      return [...keys, id] as const;
    }

    return keys;
  },
  details: () => [...chirpKeys.all(), 'detail'] as const,
  detail: (id: string) => [...chirpKeys.details(), id] as const,
  update: (filter: UpdateFilter) => [...chirpKeys.all(), filter] as const,
};

export default chirpKeys;
