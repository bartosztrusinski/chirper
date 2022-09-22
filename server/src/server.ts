import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import connectDB from './config/db';
import apiRoutes from './routes';
import errorHandler from './middleware/error';
import notFound from './middleware/notFound';
import config from './config/general';

connectDB();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.app.port, () => {
  console.log(
    `Server is running on port ${config.app.port} in ${config.app.environment} mode`
  );
});
