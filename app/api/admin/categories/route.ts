import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
import Post from "@models/postModel";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const session = await getServerSession(options);


    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const getCategoryUsage = async (filter: any = {}) => {
      return Post.aggregate([
        { $match: filter },
        { $unwind: "$categories" },
        {
          $group: {
            _id: "$categories",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            name: "$categoryInfo.name",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);
    };

    const categoryUsage = await getCategoryUsage();
    const categoryUsageThisMonth = await getCategoryUsage({
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json(
      { category: categoryUsage, thisMonth: categoryUsageThisMonth },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch system category data" },
      { status: 500 }
    );
  }
};
