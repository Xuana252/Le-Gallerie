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
      {
        $lookup: {
          from: "users", // Assuming "users" is the name of your user collection
          localField: "user", // Field to join with the user collection, assuming this is where the reporter's user ID is stored
          foreignField: "_id",
          as: "userDetails", // This will store the populated data
        },
      },
      {
        $unwind: "$userDetails", // To get rid of the array, since we expect only one user
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
        $project: {
          target: 0,
          userDetails: 0, 
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
