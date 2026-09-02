import User from "@/models/usersSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, password, gender, location, role } = body || {};

    if (!name || !email || !password || !phone || !gender || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all required fields",
        },
        { status: 400 },
      );
    }

    if (
      !location ||
      !location.state ||
      !location.district ||
      !location.city ||
      !location.pincode
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide complete location details (State, District, City, Pincode)",
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPhone = phone.toString().trim().replace(/[^0-9]/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9)",
        },
        { status: 400 },
      );
    }

    const cleanPincode = location.pincode.toString().trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 6-digit pincode",
        },
        { status: 400 },
      );
    }

    // check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: cleanPhone,
      password: hashPassword,
      gender,
      role: role || "worker",
      location: {
        state: location.state.trim(),
        district: location.district.trim(),
        city: location.city.trim(),
        pincode: cleanPincode,
        coordinates: {
          latitude: location.coordinates?.latitude ?? null,
          longitude: location.coordinates?.longitude ?? null,
        },
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const userObj = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      location: user.location,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Signup Successfully",
        role: user.role,
        user: userObj,
      },
      { status: 201 },
    );

    // Set Cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Registration failed",
      },
      { status: 500 },
    );
  }
}

