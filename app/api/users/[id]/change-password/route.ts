import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { newPassword} = await req.json();
  try {
    connectToDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateInfo = {
      password:hashedPassword,
    };
    const user = await User.findByIdAndUpdate(params.id, updateInfo, {
      new: true,
    });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(
      { message: "User password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user password" },
      { status: 500 }
    );
  }
};

