import Eligibility from "@/models/eligibility";
import connectDB from "@/db";

export default async function handler(req, res) {
  console.log("starting the index.js now....")
  await connectDB();

  if (req.method === "GET") {
    try {
      const eligibilityList = await Eligibility.find();
      return res.status(200).json(eligibilityList);
    } catch (error) {
      console.error("Error fetching eligibility:", error);
      return res.status(500).json({ error: "Failed to fetch eligibility data" });
    }
  } else if (req.method === "POST") {
    console.log("in the post method now")
    const { address, supported_project, eligible } = req.body;

    if (!address || !supported_project || eligible === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      console.log("accepted your data, now I will try...")
      const newEntry = new Eligibility({ address, supported_project, eligible });
      console.log("try1");
      await newEntry.save();
      console.log("try2");
      return res.status(201).json(newEntry);
      console.log("try3");
    } catch (error) {
      console.error("Error saving eligibility:", error);
      return res.status(500).json({ error: "Failed to save eligibility data" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}