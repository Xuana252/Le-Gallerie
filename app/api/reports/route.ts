import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import Report from "@models/reportModel";
import { UserRole } from "@enum/userRolesEnum";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";
  try {
    await connectToDB();
    const session = await getServerSession(options);


    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const query: any = {};
    if (searchText) {
      query.$or = [
        { _id: { $regex: searchText, $options: "i" } }, // Report ID
        { target: { $regex: searchText, $options: "i" } }, // Post ID
        { "user._id": { $regex: searchText, $options: "i" } }, // User ID
        { "user.username": { $regex: searchText, $options: "i" } }, // User name (assuming populated)
      ];
    }

    const reports = await Report.find(query)
      .populate("user", "_id email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const counts = await Report.countDocuments(query);

    return NextResponse.json({ reports: reports, counts: counts }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for reports" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const { user, reportId,targetUserId, type, content } = await req.json();
  try {
    await connectToDB();

    const newReport = {
      user: user._id,
      reportId,
      targetUserId,
      type,
      content,
    };

    await Report.findOneAndUpdate(
      {
        user: newReport.user,
        reportId: newReport.reportId,
      },
      newReport,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Report saved" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create report" },
      { status: 500 }
    );
  }
};
