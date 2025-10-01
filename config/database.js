const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string
    // ใช้ environment variable MONGODB_URI สำหรับ Atlas connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority';

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;