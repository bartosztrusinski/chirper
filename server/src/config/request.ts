const limit = {
  default: 10,
  min: 1,
  max: 100,
};

const page = {
  default: 1,
  min: 1,
  max: Math.floor(Number.MAX_SAFE_INTEGER / limit.max),
};

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
};

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
};

const config = {
  limit,
  page,
  user,
  chirp,
};

export default config;
