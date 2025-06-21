import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await connectDB();
    const { strEmail, strPassword } = await req.json();

    const user = await User.findOne({ strEmail });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(strPassword, user.strPassword);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, strEmail: user.strEmail },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    (await cookies()).set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({ token, user });
  } catch (err) {
    console.error("LOGIN error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
