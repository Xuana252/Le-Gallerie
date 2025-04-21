import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import Report from "@models/reportModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import { UserRole } from "@enum/userRolesEnum";
import Comment from "@models/commentModel";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";
  const resolvedFilterParam = parseInt(
    searchParams.get("resolvedFilter") || "0"
  );

  const reportSortParam = parseInt(searchParams.get("reportSort") || "0");

  const approvedSortParam = parseInt(searchParams.get("approvedSort") || "0");
  const pendingSortParam = parseInt(searchParams.get("pendingSort") || "0");
  try {
    await connectToDB();
    const session = await getServerSession(options);

    const skip = (page - 1) * limit;

    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const matchStage: any = { type: "Comment" };

    const groupStage = {
      _id: "$reportId",
      falseCount: {
        $sum: { $cond: [{ $eq: ["$state", false] }, 1, 0] },
      },
      trueCount: {
        $sum: { $cond: [{ $eq: ["$state", true] }, 1, 0] },
      },
    };

    const pipeline: any[] = [{ $match: matchStage }, { $group: groupStage }];

    if (resolvedFilterParam === 1) {
      pipeline.push({ $match: { falseCount: 0 } });
    } else if (resolvedFilterParam === -1) {
      pipeline.push({ $match: { falseCount: { $gt: 0 } } });
    }

    const aggregated = await Report.aggregate(pipeline);

    const reportedPostIds = aggregated.map((item) => item._id);

    const query: any = { _id: { $in: reportedPostIds } };

    const userIds = [];

    if (searchText) {
      const userQuery = { username: { $regex: searchText, $options: "i" } };
      const matchingUsers = await User.find(userQuery).select("_id");
      userIds.push(...matchingUsers.map((user) => user._id));

      query.$or = [
        { content: { $regex: searchText, $options: "i" } },
        { user: { $in: userIds } },
      ];
    }

    const counts = await Comment.countDocuments(query);
    const comments = await Comment.find(query).populate({
      path: "user",
      select: " -password -createdAt -updatedAt -__v",
    });

    const reportMap = new Map(aggregated.map((r) => [r._id.toString(), r]));

    const joined = comments.map((post) => {
      const report = reportMap.get(post._id.toString());
      return {
        _id: post._id.toString(),
        reportTarget: post,
        falseCount: report?.falseCount || 0,
        trueCount: report?.trueCount || 0,
        type: "Comment",
      };
    });

    if (reportSortParam !== 0) {
      joined.sort((a, b) => {
        const aTotal = a.falseCount + a.trueCount;
        const bTotal = b.falseCount + b.trueCount;
        return reportSortParam > 0 ? bTotal - aTotal : aTotal - bTotal;
      });
    } else if (approvedSortParam !== 0) {
      joined.sort((a, b) =>
        approvedSortParam > 0
          ? b.trueCount - a.trueCount
          : a.trueCount - b.trueCount
      );
    } else if (pendingSortParam !== 0) {
      joined.sort((a, b) =>
        pendingSortParam > 0
          ? b.falseCount - a.falseCount
          : a.falseCount - b.falseCount
      );
    }

    const reports = joined.slice(skip, skip + limit);

    return NextResponse.json(
      { reports: reports, counts: counts },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for comments reports" },
      { status: 500 }
    );
  }
};
