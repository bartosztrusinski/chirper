import * as dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import userRoutes from './routes/user';

const PORT = process.env.PORT || 3000;
const app: Application = express();

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
