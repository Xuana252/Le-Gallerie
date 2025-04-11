import { options } from "@app/api/auth/[...nextauth]/options";
import Report from "@models/reportModel";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const session = await getServerSession(options);

    const user = await User.findById(session?.user.id);

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!user.role.includes("admin"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const result = await Report.aggregate([
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfToday } } },
            { $count: "count" },
          ],
          todayResolved: [
            { $match: { createdAt: { $gte: startOfToday }, state: true } },
            { $count: "count" },
          ],
          post: [{ $match: { type: "Post" } }, { $count: "count" }],
          comment: [{ $match: { type: "Comment" } }, { $count: "count" }],
          resolved: [{ $match: { state: true } }, { $count: "count" }],
          monthly: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: {
                  $sum: 1,
                },
                post: {
                  $sum: { $cond: [{ $eq: ["$type", "Post"] }, 1, 0] },
                },
                comment: {
                  $sum: { $cond: [{ $eq: ["$type", "Comment"] }, 1, 0] },
                },
                resolved: {
                  $sum: { $cond: [{ $eq: ["$state", true] }, 1, 0] },
                },
              },
            },
            {
              $project: {
                _id: 1,
                count: {
                  post: "$post",
                  comment: "$comment",
                  resolved: "$resolved",
                },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
        },
      },
      {
        $project: {
          today: { $ifNull: [{ $arrayElemAt: ["$today.count", 0] }, 0] },
          todayResolved: {
            $ifNull: [{ $arrayElemAt: ["$todayResolved.count", 0] }, 0],
          },
          post: { $ifNull: [{ $arrayElemAt: ["$post.count", 0] }, 0] },
          comment: { $ifNull: [{ $arrayElemAt: ["$comment.count", 0] }, 0] },
          resolved: { $ifNull: [{ $arrayElemAt: ["$resolved.count", 0] }, 0] },
          monthly: "$monthly",
        },
      },
    ]);
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch system report data" },
      { status: 500 }
    );
  }
};
