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

    const totalCountResult = await User.aggregate([
      { $count: "totalDocuments" },
    ]);
    const totalCount = totalCountResult[0]?.totalDocuments || 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const countToday = await User.countDocuments({
      createdAt: {
        $gte: startOfToday,
        $lte: new Date(), // Now
      },
    });
    
    const bannedCount = await User.countDocuments({
      banned:true,
    })

    const monthlyCountRaw = await User.aggregate([
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

    if (!monthlyCountRaw.length) {
      return NextResponse.json(
        { total: 0, today: 0, monthly: [] },
        { status: 200 }
      );
    }

    // Create lookup map
    const monthlyMap = new Map(
      monthlyCountRaw.map((entry) => [
        `${entry._id.year}-${entry._id.month}`,
        entry.count,
      ])
    );

    // Get range
    const first = monthlyCountRaw[0]._id;
    const startYear = first.year;
    const startMonth = first.month - 1; // 0-based for JS Date

    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth(); // 0-based

    // Fill missing months with 0s
    const monthlyCount = [];

    let year = startYear;
    let month = startMonth;

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const key = `${year}-${month + 1}`; // month in 1-based
      monthlyCount.push({
        _id: { year, month: month + 1 },
        count: monthlyMap.get(key) || 0,
      });

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
    return NextResponse.json(
      { total: totalCount, today: countToday , banned: bannedCount, monthly: monthlyCount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch system user data" },
      { status: 500 }
    );
  }
};
