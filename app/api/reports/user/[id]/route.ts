import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import Report from "@models/reportModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const session = await getServerSession(options);

    const user = await User.findById(session?.user.id);

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!user.role.includes("admin"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reports = await Report.aggregate([
      {
        $match: { type: { $in: ["Post", "Comment"] } },
      },
      {
        $lookup: {
          from: "posts",
          localField: "reportId",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "reportId",
          foreignField: "_id",
          as: "comment",
        },
      },
      {
        $addFields: {
          target: {
            $cond: [
              { $eq: ["$type", "Post"] },
              { $arrayElemAt: ["$post", 0] },
              { $arrayElemAt: ["$comment", 0] },
            ],
          },
        },
      },
      {
        $match: {
          $or: [
            { "target.creator": new mongoose.Types.ObjectId(params.id) },
            { "target.user": new mongoose.Types.ObjectId(params.id) },
          ],
        },
      },
    ]);

    return NextResponse.json(
      { reports: reports, counts: reports.length },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for users reports" },
      { status: 500 }
    );
  }
};
