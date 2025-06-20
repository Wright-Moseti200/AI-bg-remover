import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI);
  console.log('Database connected');
};

export default connectDB;
