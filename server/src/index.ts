import 'dotenv/config';
import connectDB from './config/db.config';
import app from './app';

connectDB();

export default app;
