import Job from "@/models/jobSchema";
import Application from "@/models/applicationSchema";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { uploadToCloudinary } from "@/lib/cloudinary";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

// GET: Fetch applications for this job (employer view or worker's own application)
export async function GET(req, { params }) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Please log in to view applications." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    const isEmployerOwner =
      job.employerId?.toString() === authUser.userId ||
      authUser.role === "admin";

    if (isEmployerOwner) {
      const applications = await Application.find({ jobId: id })
        .populate("workerId", "name email phone location")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          count: applications.length,
          applications,
        },
        { status: 200 }
      );
    }

    // Otherwise, return worker's own application
    const workerApp = await Application.findOne({
      jobId: id,
      workerId: authUser.userId,
    });

    return NextResponse.json(
      {
        success: true,
        hasApplied: Boolean(workerApp),
        application: workerApp,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch applications.",
      },
      { status: 500 }
    );
  }
}

// POST: Apply for a job with name, image, work experience, phone, and joining date
export async function POST(req, { params }) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Please log in to apply for this job." },
        { status: 401 }
      );
    }

    if (authUser.role === "employer") {
      return NextResponse.json(
        { success: false, message: "Employers cannot apply for jobs." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    if (job.status !== "Open") {
      return NextResponse.json(
        {
          success: false,
          message: "This job opening is currently closed.",
        },
        { status: 400 }
      );
    }

    // Check if worker has already applied
    const existing = await Application.findOne({
      workerId: authUser.userId,
      jobId: id,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already applied for this job.",
          applicationStatus: existing.status,
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      name,
      mobileNumber,
      phone,
      image,
      workExperience,
      joiningDate,
      additionalNotes,
    } = body || {};

    const applicantName = (name || "").trim();
    const rawPhone = (mobileNumber || phone || "").toString().trim();
    const exp = (workExperience || "").trim();
    const joinDate = (joiningDate || "").trim();
    const notes = (additionalNotes || "").trim();

    if (!applicantName) {
      return NextResponse.json(
        { success: false, message: "Please provide your full name." },
        { status: 400 }
      );
    }

    if (!rawPhone || !/^[6-9]\d{9}$/.test(rawPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid 10-digit Indian mobile number.",
        },
        { status: 400 }
      );
    }

    if (!exp) {
      return NextResponse.json(
        {
          success: false,
          message: "Please specify your work experience (e.g. Fresher, 1 Year, etc.).",
        },
        { status: 400 }
      );
    }

    if (!joinDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Please specify your joining availability (e.g. Immediate, 1 week later).",
        },
        { status: 400 }
      );
    }

    // Upload worker image (photo / proof) to Cloudinary if provided
    let uploadedImageUrl = "";
    if (image && typeof image === "string") {
      uploadedImageUrl = await uploadToCloudinary(image, "kaamsaathi/applications");
    }

    const application = await Application.create({
      workerId: authUser.userId,
      jobId: id,
      name: applicantName,
      mobileNumber: rawPhone,
      image: uploadedImageUrl,
      workExperience: exp,
      joiningDate: joinDate,
      additionalNotes: notes,
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully! The employer has been notified.",
        application,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already applied for this job.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to submit application.",
      },
      { status: 500 }
    );
  }
}

// PATCH: Employer updates status (Accepted / Rejected) of an application
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found." },
        { status: 404 }
      );
    }

    const isEmployerOwner =
      job.employerId?.toString() === authUser.userId ||
      authUser.role === "admin";

    if (!isEmployerOwner) {
      return NextResponse.json(
        { success: false, message: "Only the employer can update applications." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { applicationId, status } = body || {};

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "Application ID is required." },
        { status: 400 }
      );
    }

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid application status." },
        { status: 400 }
      );
    }

    const updatedApp = await Application.findOneAndUpdate(
      { _id: applicationId, jobId: id },
      { status },
      { new: true }
    ).populate("workerId", "name email phone location");

    if (!updatedApp) {
      return NextResponse.json(
        { success: false, message: "Application record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Application marked as ${status}.`,
        application: updatedApp,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to update application status.",
      },
      { status: 500 }
    );
  }
}
