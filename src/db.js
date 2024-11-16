require("dotenv").config({ path: ".env" });
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "mongodb+srv://pajerovahedvika:qbIV8mU5I63qDCJY@ethglobaltest.v9bk8.mongodb.net/proof_of_donation?authSource=admin&compressors=zlib&retryWrites=true&w=majority&ssl=true";

process.env.DEBUG = "mongodb:*";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Loaded URI:", uri);
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("MongoClient set Successfully!");

    await client.connect();
    console.log("MongoDB Connected Successfully!");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client; // Return the client instance
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

module.exports = connectDB;