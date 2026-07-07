import User from "@/models/usersSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, phone, password, gender, location } = await req.json();

    // check existing user;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exist" });
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

    // Create JWT token;
    const token = jwt.sign({ userId: user._id }, "secret", {
      expiresIn: "1d",
    });
    resizeBy.cookies("token", token);
    return NextResponse.json({ message: "SignUp Successfully" });
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
