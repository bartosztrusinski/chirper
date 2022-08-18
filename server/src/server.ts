import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import userRoutes from './routes/user';
import errorHandler from './middleware/error';
import connectDB from './config/db';
import { NotFoundError } from './utils/errors';

connectDB();

const app: Application = express();
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => {
  throw new NotFoundError('Sorry! Route you are looking for does not exist');
});

app.use(errorHandler);

app.listen(app.get('port'), () => {
  console.log(
    `Server is running on port ${app.get('port')} in ${app.get('env')} mode`
  );
});
