const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    resume: {
      type: String, // Path to resume file
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Scheduled", "Ongoing", "Selected", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
