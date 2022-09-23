import { connection } from 'mongoose';

const listenForDBConnectionErrors = () => {
  connection.on('error', (error) => {
    console.error(error);
    process.exit(1);
  });

  connection.on('disconnected', (error) => {
    console.error(error);
    process.exit(1);
  });
};

export default listenForDBConnectionErrors;
