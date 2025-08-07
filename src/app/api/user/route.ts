import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { insertOneDB } from "@/lib/common/functions/DB/mongoQueries";

export async function POST(req: NextRequest) {
  try {
    const { strName, strEmail, strPassword } = await req.json();
    console.log(strPassword, "Paswrods ehhh");

    const hashedPassword = await bcrypt.hash(strPassword, 12);

    const insertedUser = await insertOneDB({
      strCollection: "users",
      objDocument: {
        strName,
        strEmail,
        strPassword: hashedPassword,
      },
    });
    console.log(insertedUser, ">>>>>>>inser ted ehh");

    return NextResponse.json(
      { strMessage: "User Created Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
