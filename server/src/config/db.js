const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      console.log('Connecting to MongoDB via MONGODB_URI...');
      await mongoose.connect(mongoUri);
      console.log('Successfully connected to MongoDB Atlas / Remote Cluster.');
      return;
    }

    // Zero-config fallback: MongoMemoryServer for development / testing
    console.log('No MONGODB_URI configured. Initializing embedded MongoDB Memory Server for zero-friction evaluation...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    
    await mongoose.connect(uri);
    console.log(`Connected to Embedded MongoDB at: ${uri}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // If MongoMemoryServer also fails or binary download was skipped, try local standard default
    try {
      console.log('Attempting connection to local mongodb://127.0.0.1:27017/ai_guidance...');
      await mongoose.connect('mongodb://127.0.0.1:27017/ai_guidance');
      console.log('Connected to local MongoDB instance.');
    } catch (fallbackErr) {
      console.error('Could not connect to any MongoDB instance:', fallbackErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
  } catch (err) {
    console.error('Error during DB disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
