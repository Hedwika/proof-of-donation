const connectDB = require("../../../db");

export default async function handler(req, res) {
  let client; // Declare the client outside try-catch for proper cleanup
  try {
    console.log("Starting with index.js now")
    // Connect to MongoDB
    client = await connectDB();

    // Access your database and collection
    const db = client.db("proof_of_donation");
    const collection = db.collection("eligibility");

    if (req.method === "POST") {
      const { address, eligible } = req.body;

      if (!address || eligible === undefined) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Insert a new document into the collection
      const result = await collection.insertOne({ address, eligible });
      return res.status(201).json(result);
    } else if (req.method === "GET") {
      // Retrieve all documents from the collection
      const allEligibility = await collection.find().toArray();
      return res.status(200).json(allEligibility);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling the request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) {
      await client.close(); // Ensure the connection is properly closed
    }
  }
}
