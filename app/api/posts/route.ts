import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";
import { NextResponse } from "@node_modules/next/server";
import Category from "@models/categoryModel";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";
  const categoryIdsParam = searchParams.get("categoryIds") || "";

  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const skip = (page - 1) * limit;

    // Build the query object
    const query: any = {
      creator: {
        $nin: currentUser?.blocked,
      },
    };

    const userIds = [];
    const categoryIds = categoryIdsParam.split(',').filter(id => id);

    if (searchText) {
      // Step 2: Fetch matching users
      const userQuery = { username: { $regex: searchText, $options: "i" } };
      const matchingUsers = await User.find(userQuery).select("_id");
      userIds.push(...matchingUsers.map((user) => user._id));

      // Build the $or query
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { creator: { $in: userIds } },
      ];
    }

    // Step 3: Filter by category IDs if any
    if (categoryIds.length > 0) {
      query.categories = { $in: categoryIds };
    }
    const count = await Post.countDocuments(query);
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id creator title categories description image likes createdAt")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    return NextResponse.json({ posts: posts, counts: count }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};
