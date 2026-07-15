import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected successfully`);
  } 
  catch (error) {
    console.error(`(Database Error) connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
