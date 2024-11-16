import mongoose from "mongoose";

const EligibilitySchema = new mongoose.Schema({
  address: { type: String, required: true },
  collection: { type: String, required: true },
  eligible: { type: Boolean, required: true },
});

export default mongoose.models.eligibility || mongoose.model("Eligibility", EligibilitySchema);