import { getOneDB } from "@/lib/common/functions/DB/mongoQueries";
import { message } from "antd";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { strEmail, strPassword } = await req.json();

    const user = await getOneDB({
      strCollection: "users",
      objQuery: {
        strEmail,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(strPassword, user?.strPassword);
    console.log(isMatch, "is match ehhhh");

    if (!isMatch) {
      return NextResponse.json(
        { message: "invalid Credentials" },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { userId: user?._id, strEmail: user?.strEmail },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    (await cookies()).set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json(
      { success: true, strToken: token, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
