import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows/Node.js c-ares DNS resolving querySrv ECONNREFUSED for MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DATABASE
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
