import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";

  try {
    await connectToDB();
    const session = await getServerSession(options);

    const user = await User.findById(session?.user.id);

    const isObjectId = mongoose.Types.ObjectId.isValid(searchText);

    const query = searchText
      ? {
          $or: [
            ...(isObjectId
              ? [{ _id: new mongoose.Types.ObjectId(searchText) }]
              : []),
            { username: { $regex: searchText, $options: "i" } },
            { email: { $regex: searchText, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({ banned: false, ...query })
      .select("-password  -updatedAt -__v")
      .skip((page - 1) * limit)
      .limit(limit);

    const counts = await User.countDocuments({ banned: false, ...query });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!user.role.includes("admin"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ users: users, counts: counts }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for system Users" },
      { status: 500 }
    );
  }
};
