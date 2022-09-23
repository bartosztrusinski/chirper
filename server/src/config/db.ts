import { connect, connection } from 'mongoose';
import config from './general';
import listenForErrors from '../utils/listenForDBConnectionErrors';

const connectDB = async () => {
  try {
    await connect(config.db.uri);
    listenForErrors();
    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
