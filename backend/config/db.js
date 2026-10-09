const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // Ensure Node.js can resolve MongoDB Atlas SRV records on Windows environments
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (dnsErr) {
      console.warn('[DNS Warning] Could not set custom DNS servers:', dnsErr.message);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/habitflow');
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Error] Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
