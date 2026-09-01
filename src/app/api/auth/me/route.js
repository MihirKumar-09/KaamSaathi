import User from "@/models/usersSchema";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated", user: null },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token", user: null },
        { status: 401 }
      );
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload", user: null },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", user: null },
        { status: 404 }
      );
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
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message, user: null },
      { status: 500 }
    );
  }
}
