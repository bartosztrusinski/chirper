import 'dotenv/config';
import connectDB from './config/db';
import app from './app';
import config from './config/general';

connectDB();

const port = config.app.port;
const env = config.app.environment;

app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${env} mode`);
});
