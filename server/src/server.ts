import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import userRoutes from './routes/user';
import errorHandler from './middleware/error';
import connectDB from './config/db';
import { NotFoundError } from './utils/errors';

connectDB();

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => {
  throw new NotFoundError('Sorry! Route you are looking for does not exist');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
