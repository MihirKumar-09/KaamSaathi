import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    salary: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      type: {
        type: String,
        enum: ["Monthly", "Yearly"],
        default: "Monthly",
      },
    },
    location: {
      state: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        default: "",
      },
      pincode: {
        type: String,
        match: [/^\d{6}$/, "Invalid pincode"],
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          default: null,
        },
        longitude: {
          type: Number,
          default: null,
        },
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Driver",
        "Electrician",
        "Plumber",
        "Carpenter",
        "Painter",
        "Cook",
        "Housekeeping",
        "Security Guard",
        "Delivery",
        "Gardener",
        "Mechanic",
        "Welder",
        "Mason",
        "Tailor",
        "Cleaner",
        "AC Technician",
        "Beautician",
        "Helper",
        "Other",
      ],
    },
    vacancy: {
      type: Number,
      default: 1,
      min: 1,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true },
);

const Job = mongoose.models.Job || mongoose.models("Job", jobSchema);
export default Job;
