import mongoose from 'mongoose';
import { MONGODB_URI } from '../utils/secrets';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    listenForErrors();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const listenForErrors = () => {
  mongoose.connection.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', (error) => {
    console.error(error);
    process.exit(1);
  });
};

export default connectDB;
