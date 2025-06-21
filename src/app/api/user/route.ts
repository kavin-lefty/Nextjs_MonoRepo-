import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const users = await User.find();

    return NextResponse.json(users);
  } catch (err) {
    console.error("GET /api/user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(body.id, body, {
      new: true, // return updated document
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("PUT /api/user/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
