import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import Report from "@models/reportModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserRole } from "@enum/userRolesEnum";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const session = await getServerSession(options);

    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const reports = await Report.aggregate([
      {
        $match: {
          targetUserId: new mongoose.Types.ObjectId(params.id),
        },
      },
      {
        $group: {
          _id: "$reportId",
          type: { $first: "$type" },
          trueCount: {
            $sum: {
              $cond: [{ $eq: ["$state", true] }, 1, 0],
            },
          },
          falseCount: {
            $sum: {
              $cond: [{ $eq: ["$state", false] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "_id",
          as: "comment",
        },
      },
      {
        $addFields: {
          reportTarget: {
            $cond: [
              { $eq: ["$type", "Post"] },
              { $arrayElemAt: ["$post", 0] },
              { $arrayElemAt: ["$comment", 0] },
            ],
          },
        },
      },
      {
        $project: {
          post: 0,
          comment: 0,
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
