import { connect, connection } from 'mongoose';
import config from './general';

const connectDB = async () => {
  try {
    await connect(config.db.uri);
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
