import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.strPassword, 10);

    const newUser = await User.create({
      ...body,
      strPassword: hashedPassword, // this will override the plain one if present
    });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
