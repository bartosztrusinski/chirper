const limit = { default: 10, min: 1, max: 100 } as const;

const page = {
  default: 1,
  min: 1,
  max: Math.floor(Number.MAX_SAFE_INTEGER / limit.max),
} as const;

const user = {
  username: { min: 5, max: 24 },
  password: { min: 8, max: 64 },
  name: { max: 24 },
  bio: { max: 160 },
  location: { max: 30 },
  website: { max: 100 },
  fields: {
    default: 'username',
    allowed: ['username', 'profile', 'metrics', '_id', 'createdAt'],
  },
} as const;

const chirp = {
  content: { max: 140 },
  sort: { default: 'relevant', allowed: ['relevant', 'recent', 'popular'] },
  fields: {
    default: 'content',
    allowed: [
      'content',
      'author',
      'replies',
      'post',
      'parent',
      'metrics',
      '_id',
      'createdAt',
    ],
  },
} as const;

const follow = { fields: { default: 'targetUser sourceUser' } } as const;

const like = { fields: { default: 'chirp user' } } as const;

const config = { limit, page, user, chirp, follow, like } as const;

export default config;
