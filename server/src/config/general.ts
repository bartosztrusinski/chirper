const environment =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const defaults = {
  port: 3000,
  dbUri: 'mongodb://localhost:27017/db',
  jwtSecret: 'someRandomSecret',
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
    port: port[environment] || defaults.port,
    environment,
  },
  db: {
    uri: dbUri[environment] || defaults.dbUri,
  },
  jwt: {
    secret: jwtSecret[environment] || defaults.jwtSecret,
  },
};

export default config;
