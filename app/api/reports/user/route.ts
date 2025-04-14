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
          type: { $in: ["Post", "Comment"] },
          targetUserId: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "targetUserId",
          foreignField: "_id",
          as: "targetedUser",
        },
      },
      {
        $unwind: "$targetedUser",
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $addFields: {
          user: {
            _id: "$userDetails._id",
            email: "$userDetails.email",
          },
        },
      },
      {
        $group: {
          _id: "$targetUserId",
          user: { $first: "$targetedUser" },
          reports: {
            $push: {
              _id: "$_id",
              content: "$content",
              type: "$type",
              createdAt: "$createdAt",
              reportId: "$reportId",
              state: "$state",
              user: "$user", // reporter info
            },
          },
          count: { $sum: 1 },
        }
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
