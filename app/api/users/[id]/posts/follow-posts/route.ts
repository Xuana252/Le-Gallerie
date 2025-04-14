import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import Like from "@models/likesModel";
import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Follow from "@models/followModel";
import { UserRole } from "@enum/userRolesEnum";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    connectToDB();

    const skip = (page - 1) * limit;

    const session = await getServerSession(options);
    const isAdmin = session?.user.role?.includes(UserRole.ADMIN);

    const currentFriend = await Friend.find({
      $or: [{ user1: session?.user.id }, { user2: session?.user.id }],
      state: FriendState.FRIEND,
    });

    const currentFollow = await Follow.find({
      follower: session?.user.id,
    });

    const currentFollowIds = currentFollow.map((follow) => follow.user);

    const currentFriendIds = currentFriend.map((friend) =>
      friend.user1.toString() === session?.user.id
        ? friend.user2.toString()
        : friend.user1.toString()
    );

    const query: any = {
      isDeleted: false,
      creator: { $in: currentFollowIds },
    };

    if (!isAdmin) {
      query.privacy = { $ne: "private" };
      query.$or = [
        { privacy: "public" },
        { creator: session?.user.id },
        {
          $and: [{ privacy: "friend" }, { creator: { $in: currentFriendIds } }],
        },
      ];
    }

    const followPostCount = await Post.countDocuments(query);

    const followPosts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-updatedAt -__v")
      .populate({
        path: "creator",
        select: "-email -password -updatedAt -__v",
      })
      .populate("categories");

    return NextResponse.json(
      { posts: followPosts, counts: followPostCount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for user follow posts" },
      { status: 500 }
    );
  }
};
