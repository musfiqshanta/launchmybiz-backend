const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return mongoose.connection;

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/launch';
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME, // optional when using URI with db
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    isConnected = true;

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('MongoDB disconnected');
    });

    console.log(`MongoDB connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };


