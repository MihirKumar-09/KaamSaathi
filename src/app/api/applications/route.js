import Job from "@/models/jobSchema";
import Application from "@/models/applicationSchema";
import User from "@/models/usersSchema";
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

// GET: Fetch applications conditionally based on user role (worker or employer)
export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Please log in to view applications." },
        { status: 401 }
      );
    }

    if (authUser.role === "worker") {
      // Fetch all applications submitted by this worker
      const applications = await Application.find({ workerId: authUser.userId })
        .populate({
          path: "jobId",
          select: "title description salary location category vacancy status createdAt employerId",
          populate: {
            path: "employerId",
            select: "name email phone companyName",
          },
        })
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          role: "worker",
          count: applications.length,
          applications,
        },
        { status: 200 }
      );
    }

    if (authUser.role === "employer" || authUser.role === "admin") {
      // Fetch all applications received for jobs posted by this employer
      const employerJobs = await Job.find({ employerId: authUser.userId }).select("_id");
      const jobIds = employerJobs.map((j) => j._id);

      const applications = await Application.find({ jobId: { $in: jobIds } })
        .populate("jobId", "title category salary location status createdAt")
        .populate("workerId", "name email phone location")
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          role: "employer",
          count: applications.length,
          applications,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unknown user role." },
      { status: 403 }
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

// PATCH: Employer updates application status (Accepted / Rejected)
export async function PATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { applicationId, status } = body || {};

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, message: "Application ID and status are required." },
        { status: 400 }
      );
    }

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value." },
        { status: 400 }
      );
    }

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    // Verify ownership of the job
    const jobEmployerId = application.jobId?.employerId?.toString();
    if (jobEmployerId !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You do not have permission to update this application." },
        { status: 403 }
      );
    }

    application.status = status;
    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: `Application marked as ${status}.`,
        application,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to update application.",
      },
      { status: 500 }
    );
  }
}
