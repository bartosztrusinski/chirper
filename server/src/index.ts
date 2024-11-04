import 'dotenv/config';
import connectDB from './config/db.config';
import envConfig from './config/env.config';
import app from './app';

connectDB();

const port = envConfig.app.port;
const env = envConfig.app.environment;

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${env} mode`);
});
