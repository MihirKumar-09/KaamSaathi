import Job from "@/models/jobSchema";
import Application from "@/models/applicationSchema";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

// POST: Apply for a job
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

    const application = await Application.create({
      workerId: authUser.userId,
      jobId: id,
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
