import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chirper';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
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
