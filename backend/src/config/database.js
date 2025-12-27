const mongoose = require("mongoose");

const connectDB = async (retries = 5) => {
  const mongoURI =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27018/academic_management_system";

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`MongoDB connection attempt ${attempt}/${retries}...`);

      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 2, // Minimum number of connections in pool
        maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);

      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("⚠️  MongoDB disconnected. Attempting to reconnect...");
        setTimeout(() => connectDB(1), 5000); // Try to reconnect after 5 seconds
      });

      mongoose.connection.on("reconnected", () => {
        console.log("✅ MongoDB reconnected successfully");
      });

      return conn;
    } catch (error) {
      console.error(
        `❌ MongoDB connection attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === retries) {
        console.error(
          "💥 All MongoDB connection attempts failed. Please check:"
        );
        console.error("   1. Is MongoDB running? Run: start-mongodb.bat");
        console.error("   2. Is the database path accessible?");
        console.error("   3. Is port 27018 available?");
        console.error("   4. Check MongoDB logs in data/mongod.log");
        process.exit(1);
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`⏳ Waiting ${waitTime}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

module.exports = connectDB;
