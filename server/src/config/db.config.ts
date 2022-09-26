import { connect, connection } from 'mongoose';
import config from './env.config';
import { listenForDBConnectionErrors } from '../utils/helper.utils';

const connectDB = async () => {
  try {
    await connect(config.db.uri);
    listenForDBConnectionErrors();
    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
