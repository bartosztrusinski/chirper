import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URI_LOCAL;

if (!MONGODB_URI) {
  console.error(
    'No MongoDB connection string provided. Set MONGODB_URI environment variable.'
  );
  process.exit(1);
}

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
