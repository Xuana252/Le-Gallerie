import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";
  const nameSort = parseInt(searchParams.get("nameSort") || "0");
  const joinSort = parseInt(searchParams.get("joinSort") || "0");
  const roleFilter = searchParams.get("roleFilter") || UserRole.USER;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  try {
    await connectToDB();
    const session = await getServerSession(options);

    const user = await User.findById(session?.user.id);

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!user.role.includes("admin"))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const isObjectId = mongoose.Types.ObjectId.isValid(searchText);

    let dateFilter: any = {};

    const query = searchText
      ? {
          $and: [
            {
              $or: [
                ...(isObjectId
                  ? [{ _id: new mongoose.Types.ObjectId(searchText) }]
                  : []),
                { username: { $regex: searchText, $options: "i" } },
                { email: { $regex: searchText, $options: "i" } },
              ],
            },

            { banned: false },
          ],
        }
      : {
          banned: false,
        };

    (query as any).role = { $in: [roleFilter] };

    const startDate = startDateParam ? new Date(startDateParam) : null;
    const endDate = endDateParam ? new Date(endDateParam) : null;

    if (startDate && endDate) {
      (query as any).createdAt = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      (query as any).createdAt = { $gte: startDate };
    } else if (endDate) {
      (query as any).createdAt = { $lte: endDate };
    }

    if (Object.keys(dateFilter).length) {
      (query as any).createdAt = dateFilter;
    }

    // Handle sorting
    let sortOptions: Record<string, 1 | -1> = {};
    if (nameSort !== 0) sortOptions.username = nameSort as 1 | -1;
    if (joinSort !== 0) sortOptions.createdAt = joinSort as 1 | -1;

    const users = await User.find(query)
      .collation({ locale: "en", strength: 1 })
      .sort(sortOptions || {})
      .select("-password  -updatedAt -__v")
      .skip((page - 1) * limit)
      .limit(limit);

    const counts = await User.countDocuments(query);

    

    return NextResponse.json(
      { users: users, counts: counts },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for system Users" },
      { status: 500 }
    );
  }
};
