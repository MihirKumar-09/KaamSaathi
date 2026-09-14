import User from "@/models/usersSchema";
import Job from "@/models/jobSchema";
import Application from "@/models/applicationSchema";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
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

// GET: Fetch user profile details and activity statistics
export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(authUser.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Activity stats based on role
    let stats = {};
    if (user.role === "worker") {
      const totalApplied = await Application.countDocuments({ workerId: user._id });
      const pendingReview = await Application.countDocuments({
        workerId: user._id,
        status: "Pending",
      });
      const acceptedCount = await Application.countDocuments({
        workerId: user._id,
        status: "Accepted",
      });
      stats = { totalApplied, pendingReview, acceptedCount };
    } else if (user.role === "employer" || user.role === "admin") {
      const totalPostedJobs = await Job.countDocuments({ employerId: user._id });
      const openJobs = await Job.countDocuments({
        employerId: user._id,
        status: "Open",
      });
      const employerJobs = await Job.find({ employerId: user._id }).select("_id");
      const jobIds = employerJobs.map((j) => j._id);
      const totalApplicationsReceived = await Application.countDocuments({
        jobId: { $in: jobIds },
      });
      stats = { totalPostedJobs, openJobs, totalApplicationsReceived };
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          location: user.location,
          profileImage: user.profileImage || "",
          bio: user.bio || "",
          createdAt: user.createdAt,
        },
        stats,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH: Update user profile and optional password change
export async function PATCH(req) {
  try {
    await connectDB();
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      name,
      phone,
      gender,
      location,
      profileImage,
      bio,
      currentPassword,
      newPassword,
    } = body || {};

    // Validate Name
    if (name !== undefined) {
      const cleanName = name.trim();
      if (!cleanName) {
        return NextResponse.json(
          { success: false, message: "Name cannot be empty." },
          { status: 400 }
        );
      }
      user.name = cleanName;
    }

    // Validate Phone
    if (phone !== undefined) {
      const cleanPhone = phone.trim();
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid 10-digit mobile number." },
          { status: 400 }
        );
      }
      user.phone = cleanPhone;
    }

    // Gender
    if (gender !== undefined && ["Male", "Female", "Other"].includes(gender)) {
      user.gender = gender;
    }

    // Location
    if (location && typeof location === "object") {
      if (!user.location) user.location = {};
      if (location.state !== undefined) user.location.state = location.state.trim();
      if (location.district !== undefined) user.location.district = location.district.trim();
      if (location.city !== undefined) user.location.city = location.city.trim();
      if (location.pincode !== undefined) {
        const cleanPin = location.pincode.toString().trim();
        if (/^\d{6}$/.test(cleanPin)) {
          user.location.pincode = cleanPin;
        }
      }
    }

    // Bio
    if (bio !== undefined) {
      user.bio = bio.trim().slice(0, 500);
    }

    // Profile Image upload to Cloudinary
    if (profileImage !== undefined && profileImage) {
      if (profileImage.startsWith("data:image/") || profileImage.startsWith("http")) {
        const uploadedUrl = await uploadToCloudinary(profileImage, "kaamsaathi/profiles");
        user.profileImage = uploadedUrl;
      }
    }

    // Optional Password Change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Current password does not match." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 6 characters." },
          { status: 400 }
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          location: user.location,
          profileImage: user.profileImage || "",
          bio: user.bio || "",
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
