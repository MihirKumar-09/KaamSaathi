import Job from "@/models/jobSchema";
import User from "@/models/usersSchema";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper to authenticate request
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET: Fetch jobs posted by the employer (or all open jobs if public)
export async function GET(req) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();
    const { searchParams } = new URL(req.url);
    const filterMyJobs = searchParams.get("my") === "true" || !searchParams.has("public");

    if (filterMyJobs) {
      if (!authUser) {
        return NextResponse.json(
          { success: false, message: "Unauthorized. Please log in." },
          { status: 401 }
        );
      }

      const jobs = await Job.find({ employerId: authUser.userId })
        .sort({ createdAt: -1 })
        .populate("employerId", "name email phone");

      return NextResponse.json(
        {
          success: true,
          count: jobs.length,
          jobs,
        },
        { status: 200 }
      );
    }

    // Public jobs listing (for workers)
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const query = { status: "Open" };

    if (category) query.category = category;
    if (city) query["location.city"] = new RegExp(city, "i");

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("employerId", "name email phone");

    return NextResponse.json(
      {
        success: true,
        count: jobs.length,
        jobs,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch jobs",
      },
      { status: 500 }
    );
  }
}

// POST: Create a new job
export async function POST(req) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Verify user role
    const user = await User.findById(authUser.userId);
    if (!user || (user.role !== "employer" && user.role !== "admin")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only employers can post jobs.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      salary,
      location,
      category,
      vacancy,
      status,
    } = body || {};

    // Validate Required Fields
    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required.",
        },
        { status: 400 }
      );
    }

    if (title.trim().length > 80) {
      return NextResponse.json(
        {
          success: false,
          message: "Title cannot exceed 80 characters.",
        },
        { status: 400 }
      );
    }

    if (description.trim().length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Description cannot exceed 2000 characters.",
        },
        { status: 400 }
      );
    }

    // Salary validation
    const salaryAmount = Number(salary?.amount);
    if (isNaN(salaryAmount) || salaryAmount < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid salary amount.",
        },
        { status: 400 }
      );
    }

    const salaryType = salary?.type === "Yearly" ? "Yearly" : "Monthly";

    // Location validation
    if (!location?.state || !location?.city || !location?.pincode) {
      return NextResponse.json(
        {
          success: false,
          message: "State, city, and pincode are required for the job location.",
        },
        { status: 400 }
      );
    }

    const cleanPincode = location.pincode.toString().trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 6-digit Indian pincode.",
        },
        { status: 400 }
      );
    }

    // Vacancy validation
    const numVacancy = vacancy ? Math.max(1, parseInt(vacancy, 10)) : 1;

    // Create Job Document
    const newJob = await Job.create({
      title: title.trim(),
      description: description.trim(),
      salary: {
        amount: salaryAmount,
        type: salaryType,
      },
      location: {
        state: location.state.trim(),
        city: location.city.trim(),
        address: location.address ? location.address.trim() : "",
        pincode: cleanPincode,
        coordinates: {
          latitude: location.coordinates?.latitude ?? null,
          longitude: location.coordinates?.longitude ?? null,
        },
      },
      category,
      vacancy: numVacancy,
      employerId: user._id,
      status: status === "Closed" ? "Closed" : "Open",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job posted successfully!",
        job: newJob,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to post job.",
      },
      { status: 500 }
    );
  }
}
