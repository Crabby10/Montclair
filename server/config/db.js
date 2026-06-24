const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('--- MONGO_URI is not configured. Running server with in-memory / local fallback mode. ---');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.warn('--- MongoDB Connection Failed. Running server with in-memory / local fallback mode. ---');
  }
};

module.exports = connectDB;
