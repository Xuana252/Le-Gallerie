import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";
import User from "@models/userModel";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    await connectToDB();

    const userExists = await User.exists({ email: params.email });

    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User exists" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error checking user existence" },
      { status: 500 }
    );
  }
};
