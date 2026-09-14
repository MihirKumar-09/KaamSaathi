import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Worker ID is required"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    name: {
      type: String,
      required: [true, "Applicant full name is required"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit mobile number"],
    },
    image: {
      type: String,
      default: "",
    },
    workExperience: {
      type: String,
      required: [true, "Work experience is required"],
      trim: true,
    },
    joiningDate: {
      type: String,
      required: [true, "Joining availability is required"],
      trim: true,
    },
    additionalNotes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

// Prevent duplicate applications by the same worker for the same job
applicationSchema.index({ workerId: 1, jobId: 1 }, { unique: true });

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;
