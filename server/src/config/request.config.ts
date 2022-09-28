const limit = {
  default: 10,
  min: 1,
  max: 100,
} as const;

const page = {
  default: 1,
  min: 1,
  max: Math.floor(Number.MAX_SAFE_INTEGER / limit.max),
} as const;

const user = {
  fields: {
    default: 'username',
    allowed: ['username', 'profile', 'metrics', '_id', 'createdAt'],
  },
  username: {
    min: 5,
    max: 50,
  },
  password: {
    min: 8,
    max: 64,
  },
  name: {
    max: 50,
  },
  bio: {
    max: 160,
  },
  location: {
    max: 30,
  },
  website: {
    max: 100,
  },
} as const;

const chirp = {
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
  content: {
    max: 140,
  },
  sort: {
    default: 'relevant',
    allowed: ['relevant', 'recent', 'popular'],
  },
} as const;

const follow = {
  fields: {
    default: 'targetUser sourceUser',
  },
} as const;

const like = {
  fields: {
    default: 'chirp user',
  },
} as const;

const rate = {
  limit: 100,
  timeFrameMinutes: 15,
} as const;

const config = {
  limit,
  page,
  user,
  chirp,
  follow,
  like,
  rate,
} as const;

export default config;
