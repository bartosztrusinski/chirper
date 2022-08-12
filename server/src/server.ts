import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import 'express-async-errors';
import userRoutes from './routes/user';
import errorHandler from './middleware/error';
import connectDB from './config/db';

connectDB();

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
