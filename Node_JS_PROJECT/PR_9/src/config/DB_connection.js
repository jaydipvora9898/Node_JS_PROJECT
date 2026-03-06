const mongoose = require("mongoose");

const DB_connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log(" MongoDB connected: API_Stucture database");
  } catch (err) {
    console.error(" MongoDB connection error:", err);
  }
};

module.exports = DB_connection;
