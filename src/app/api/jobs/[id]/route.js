import Job from "@/models/jobSchema";
import User from "@/models/usersSchema";
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

// GET: Fetch single job details, application status, and related jobs
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const job = await Job.findById(id).populate(
      "employerId",
      "name email phone companyName createdAt"
    );

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check if authenticated user is the job owner or has applied
    let hasApplied = false;
    let applicationStatus = null;
    let isOwner = false;

    const authUser = await getAuthenticatedUser();
    if (authUser && authUser.userId) {
      const employerIdStr = job.employerId?._id
        ? job.employerId._id.toString()
        : job.employerId?.toString();

      if (authUser.userId === employerIdStr || authUser.role === "admin") {
        isOwner = true;
      }

      const existingApp = await Application.findOne({
        workerId: authUser.userId,
        jobId: id,
      });
      if (existingApp) {
        hasApplied = true;
        applicationStatus = existingApp.status;
      }
    }

    // Fetch related jobs in same category (or fallback to latest open jobs), excluding current job
    let relatedJobs = await Job.find({
      _id: { $ne: id },
      status: "Open",
      category: job.category,
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("employerId", "name email phone");

    if (relatedJobs.length < 2) {
      const moreJobs = await Job.find({
        _id: { $nin: [id, ...relatedJobs.map((j) => j._id)] },
        status: "Open",
      })
        .sort({ createdAt: -1 })
        .limit(4 - relatedJobs.length)
        .populate("employerId", "name email phone");

      relatedJobs = [...relatedJobs, ...moreJobs];
    }

    return NextResponse.json(
      {
        success: true,
        job,
        relatedJobs,
        hasApplied,
        applicationStatus,
        isOwner,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch job details" },
      { status: 500 }
    );
  }
}

// PATCH: Toggle status or edit job
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (job.employerId.toString() !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You do not have permission to modify this job" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.status !== undefined) {
      job.status = body.status === "Closed" ? "Closed" : "Open";
    }

    if (body.title !== undefined) job.title = body.title.trim();
    if (body.category !== undefined) job.category = body.category.trim();
    if (body.description !== undefined) job.description = body.description.trim();
    if (body.vacancy !== undefined) job.vacancy = Math.max(1, parseInt(body.vacancy, 10) || 1);

    if (body.salary) {
      if (body.salary.amount !== undefined) {
        job.salary.amount = Number(body.salary.amount);
      }
      if (body.salary.type !== undefined) {
        job.salary.type = body.salary.type;
      }
    }

    if (body.location) {
      if (body.location.state !== undefined) job.location.state = body.location.state.trim();
      if (body.location.city !== undefined) job.location.city = body.location.city.trim();
      if (body.location.address !== undefined) job.location.address = body.location.address.trim();
      if (body.location.pincode !== undefined) {
        const cleanPin = body.location.pincode.toString().trim();
        if (/^\d{6}$/.test(cleanPin)) {
          job.location.pincode = cleanPin;
        }
      }
      if (body.location.coordinates) {
        if (body.location.coordinates.latitude !== undefined) {
          job.location.coordinates.latitude = body.location.coordinates.latitude;
        }
        if (body.location.coordinates.longitude !== undefined) {
          job.location.coordinates.longitude = body.location.coordinates.longitude;
        }
      }
    }

    await job.save();
    await job.populate("employerId", "name email phone");

    return NextResponse.json(
      {
        success: true,
        message: "Job updated successfully",
        job,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update job" },
      { status: 500 }
    );
  }
}

// DELETE: Remove job
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (job.employerId.toString() !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You do not have permission to delete this job" },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ jobId: id });

    return NextResponse.json(
      {
        success: true,
        message: "Job deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete job" },
      { status: 500 }
    );
  }
}
