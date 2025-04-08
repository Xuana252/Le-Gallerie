import { options } from "@app/api/auth/[...nextauth]/options";
import Post from "@models/postModel";
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

    const totalCountResult = await Post.aggregate([{ $count: "totalDocuments" }]);
    const totalCount = totalCountResult[0]?.totalDocuments || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 

    const countToday = await Post.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lte: new Date(), // Now
      },
    });

    const monthlyCount = await Post.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    return NextResponse.json(
      { total: totalCount, today: countToday, monthly: monthlyCount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch system post data" },
      { status: 500 }
    );
  }
};
