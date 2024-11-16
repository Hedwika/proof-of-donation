const mongoose = require("mongoose");

const uri = "mongodb+srv://pajerovahedvika:qbIV8mU5I63qDCJY@ethglobaltest.v9bk8.mongodb.net/proof_of_donation?retryWrites=true&w=majority&ssl=true&appName=ETHGlobalTest";

(async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });

    console.log("Connected to MongoDB successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
})();