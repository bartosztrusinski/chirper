type Filter = 'logIn' | 'signUp';

const authKeys = {
  all: () => ['auth'] as const,
  update: (filter: Filter) => [...authKeys.all(), filter] as const,
};

export default authKeys;
