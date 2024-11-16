require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
const { MongoClient, ServerApiVersion } = require('mongodb');

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Loaded URI:", uri);
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    console.log("MongoDB Connected Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Full Error Details:", error);
    process.exit(1);
  }
};

connectDB();