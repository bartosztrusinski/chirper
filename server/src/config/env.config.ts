const environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const defaults = {
  port: '3000',
  dbUri: 'mongodb://localhost:27017/db',
  jwtSecret: 'someRandomSecret',
  jwtExpiresIn: '7d',
  clientUrl: 'http://localhost:8080',
};

const port = {
  production: process.env.PORT,
  development: process.env.DEV_PORT,
};

const dbUri = {
  production: process.env.MONGODB_URI,
  development: process.env.DEV_MONGODB_URI,
};

const jwtSecret = {
  production: process.env.JWT_SECRET,
  development: process.env.DEV_JWT_SECRET,
};

const config = {
  app: {
    environment,
    port: port[environment] || defaults.port,
    clientUrl: process.env.CLIENT_URL || defaults.clientUrl,
  },
  db: {
    uri: dbUri[environment] || defaults.dbUri,
  },
  jwt: {
    secret: jwtSecret[environment] || defaults.jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || defaults.jwtExpiresIn,
  },
} as const;

export default config;
