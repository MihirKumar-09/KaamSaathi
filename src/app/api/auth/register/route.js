import User from "@/models/usersSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone, password, gender, location } = await req.json();

    // check existing user;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 },
      );
    }

    // Hash password;
    const hashPassword = await bcrypt.hash(password, 10);

    // Crate new user;
    const user = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
      gender,
      location,
    });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set Cookie
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Signup Successfully",
      },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 },
    );
  }
}
