import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the cookie by setting it to empty and expired
  (await cookies()).set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // expires instantly
  });

  return NextResponse.json({ message: "Logged out" });
}
