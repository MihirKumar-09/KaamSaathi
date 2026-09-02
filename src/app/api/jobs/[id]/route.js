import Job from "@/models/jobSchema";
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

    if (body.status) {
      job.status = body.status === "Closed" ? "Closed" : "Open";
    }

    if (body.title) job.title = body.title.trim();
    if (body.description) job.description = body.description.trim();
    if (body.vacancy) job.vacancy = Math.max(1, parseInt(body.vacancy, 10));
    if (body.salary?.amount !== undefined) {
      job.salary.amount = Number(body.salary.amount);
      if (body.salary.type) job.salary.type = body.salary.type;
    }

    await job.save();

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
