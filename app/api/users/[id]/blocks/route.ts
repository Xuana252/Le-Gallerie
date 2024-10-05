import User from "@models/userModel";
import { connectToDB } from "@utils/database";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: { id: string } }
  ) => {
    try {
      await connectToDB();
      const userBlockedList = await User.findById(params.id)
        .select("blocked")
        .populate({path:"blocked",select:"-email -password -createdAt -updatedAt -__v"});

      return NextResponse.json(userBlockedList.blocked, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to fetch user block list" + error },
        { status: 500 }
      );
    }
  };