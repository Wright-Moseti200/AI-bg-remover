import mongoose from 'mongoose';

const connectDB = () => {
  mongoose.connect(`${process.env.MONGODB_URI}/newbgusers`);
  console.log('Database connected');
};

export default connectDB;
