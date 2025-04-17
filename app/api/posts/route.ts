import Post from "@models/postModel";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";
import { NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import Friend from "@models/friendModel";
import { FriendState } from "@enum/friendStateEnum";
import mongoose from "mongoose";
import { UserRole } from "@enum/userRolesEnum";

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

    const isAdmin = currentUser?.role.includes(UserRole.ADMIN);

    const skip = (page - 1) * limit;

    const query: any = { isDeleted: false };

    query.privacy = {}

    if (!isAdmin) {
      // Get all friend relationships
      query.privacy = { $ne: "private" };
      const currentFriend = await Friend.find({
        $or: [{ user1: session?.user.id }, { user2: session?.user.id }],
        state: FriendState.FRIEND,
      });

      const currentFriendIds = currentFriend.map((friend) =>
        friend.user1.toString() === session?.user.id
          ? friend.user2.toString()
          : friend.user1.toString()
      );

      query.creator = { $nin: currentUser?.blocked };


      query.$or = [
        { privacy: "public" },
        { creator: session?.user.id },
        {
          $and: [{ privacy: "friend" }, { creator: { $in: currentFriendIds } }],
        },
      ];
    }

    if (relatedPostId && mongoose.Types.ObjectId.isValid(relatedPostId)) {
      const relatedPost = await Post.findById(relatedPostId);

      if (relatedPost) {
        const relatedPostCreatorId = relatedPost.creator.toString();
        const relatedPostCategoryIds = relatedPost.categories.map(
          (category: any) => category._id.toString()
        );
        Object.assign(query, {
          $and: [
            ...(query.$and || []),
            {
              $or: [
                { creator: relatedPostCreatorId },
                { categories: { $in: relatedPostCategoryIds } },
              ],
            },
          ],
        });
      }
    }

    const userIds = [];
    const categoryIds = categoryIdsParam.split(",").filter((id) => id);

    if (searchText) {
      const userQuery = { username: { $regex: searchText, $options: "i" } };
      const matchingUsers = await User.find(userQuery).select("_id");
      userIds.push(...matchingUsers.map((user) => user._id));

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

    let posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-updatedAt -__v")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    posts = posts.sort((a, b) => {
      const aIsCreator = a.creator.role.includes(UserRole.CREATOR) ? 1 : 0;
      const bIsCreator = b.creator.role.includes(UserRole.CREATOR) ? 1 : 0;
      if (aIsCreator !== bIsCreator) {
        return bIsCreator - aIsCreator;
      }
      // Otherwise keep the original date order (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return NextResponse.json({ posts: posts, counts: count }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};
