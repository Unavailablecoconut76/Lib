import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "sqlproj",
      // Add these options for better connection handling
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increase timeout to 20s
      socketTimeoutMS: 45000, // Increase socket timeout
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};