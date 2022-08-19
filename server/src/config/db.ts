import { connect, connection } from 'mongoose';
import { MONGODB_URI } from '../utils/secrets';

const connectDB = async () => {
  try {
    await connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${connection.host}`);
    listenForErrors();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const listenForErrors = () => {
  connection.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });

  connection.on('disconnected', (error) => {
    console.error(error);
    process.exit(1);
  });
};

export default connectDB;
