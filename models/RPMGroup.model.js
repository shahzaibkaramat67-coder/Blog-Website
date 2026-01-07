import mongoose from "mongoose";

const rpmGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },          // High, Medium, Normal, Low
  rate_per_1000: { type: Number, required: true }, // e.g., 3, 2, 1, 0.5
  status: { type: String, default: "active" }      // active/inactive
});

export const RPMGroup = mongoose.model("RPMGroup", rpmGroupSchema);
