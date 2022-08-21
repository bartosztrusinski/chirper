export const ENVIRONMENT = process.env.NODE_ENV;
const isProduction = ENVIRONMENT === 'production';
const mongoEnvVarName = isProduction ? 'MONGODB_URI' : 'MONGODB_URI_LOCAL';

export const MONGODB_URI = tryToGetEnvironmentVariable(mongoEnvVarName);
export const JWT_SECRET = tryToGetEnvironmentVariable('JWT_SECRET');

function tryToGetEnvironmentVariable(envVarName: string) {
  const envVar = process.env[envVarName];
  if (!envVar) {
    console.error(
      `No environment variable string provided. Set ${envVarName} environment variable.`
    );
    process.exit(1);
  }
  return envVar;
}
