type ListFilter = 'followed' | 'following' | 'liking';

const userKeys = {
  all: () => ['users'] as const,
  current: () => [...userKeys.all(), 'current'] as const,
  lists: () => [...userKeys.all(), 'list'] as const,
  list: (filter: ListFilter, id: string) =>
    [...userKeys.lists(), filter, id] as const,
  details: () => [...userKeys.all(), 'detail'] as const,
  detail: (username: string) => [...userKeys.details(), username] as const,
  update: () => [...userKeys.all(), 'update'] as const,
};

export default userKeys;
