import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

applicationSchema.index({ workerId: 1, jobId: 1 }, { unique: true });

const Application =
  mongoose.models.Application ||
  mongoose.models("Application", applicationSchema);
export default Application;
