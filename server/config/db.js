const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await connect(process.env.MONGO_URI); // Updated to use MONGO_URI
    console.log("Database connected", connection.connection.host);
  } catch (error) {
    console.log("Error", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
