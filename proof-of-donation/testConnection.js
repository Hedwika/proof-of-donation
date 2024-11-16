require("dotenv").config({ path: ".env" });
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
process.env.DEBUG = "mongodb:*";

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 30000, // Increase timeouts
      socketTimeoutMS: 60000,
    });

    console.log("client: ", client);
    await client.connect(); // Attempt to connect
    console.log("MongoDB Connected Successfully!");
    await client.db("admin").command({ ping: 1 }); // Ping the database
    console.log("Ping successful!");
    await client.close();
  } catch (error) {
    console.error("Test Connection Error:", error);
  }
};

testConnection();