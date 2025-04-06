import Post from "@models/postModel";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";
import { NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import Friend from "@models/friendModel";
import { FriendState } from "@enum/friendStateEnum";
import mongoose from "mongoose";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";
  const categoryIdsParam = searchParams.get("categoryIds") || "";
  const relatedPostId = searchParams.get("relatedPostId") || "";

  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const currentFriend = await Friend.find({
      $or: [{ user1: session?.user.id }, { user2: session?.user.id }],
      state: FriendState.FRIEND,
    });

    const currentFriendIds = currentFriend.map((friend) =>
      friend.user1.toString() === session?.user.id
        ? friend.user2.toString()
        : friend.user1.toString()
    );

    const skip = (page - 1) * limit;

    // Build the query object
    const query: any = {
      privacy: { $ne: "private" },
      creator: {
        $nin: currentUser?.blocked,
      },
      $or: [
        { privacy: "public" },
        { creator: session?.user.id },
        {
          $and: [{ privacy: "friend" }, { creator: { $in: currentFriendIds } }],
        }, // Include private posts only if friend
      ],
    };

    if (relatedPostId&& mongoose.Types.ObjectId.isValid(relatedPostId)) {
      const relatedPost = await Post.findById(relatedPostId);

      if (relatedPost) {
        const relatedPostCreatorId = relatedPost.creator.toString();
        const relatedPostCategoryIds = relatedPost.categories.map(
          (category: any) => category._id.toString()
        );
        query.$or = [
          { creator: relatedPostCreatorId },
          { categories: { $in: relatedPostCategoryIds } },
        ];
      }
    }

    const userIds = [];
    const categoryIds = categoryIdsParam.split(",").filter((id) => id);

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
      .select("-updatedAt -__v")
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
