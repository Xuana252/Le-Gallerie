import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import Like from "@models/likesModel";
import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

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

    const currentFriend = await Friend.find({
      $or: [{ user1: session?.user.id }, { user2: session?.user.id }],
      state: FriendState.FRIEND,
    });

    const currentFriendIds = currentFriend.map((friend) =>
      friend.user1.toString() === session?.user.id
        ? friend.user2.toString()
        : friend.user1.toString()
    );

    const friendPostCount = await Post.countDocuments({
      privacy: { $ne: "private" },
      creator: { $in: currentFriendIds },
      $or: [
        { privacy: "public" },
        { creator: session?.user.id },
        {
          $and: [{ privacy: "friend" }, { creator: { $in: currentFriendIds } }],
        }, // Include private posts only if friend
      ],
    });

    const friendPosts = await Post.find({
      privacy: { $ne: "private" },
      creator: { $in: currentFriendIds },
      $or: [
        { privacy: "public" },
        { creator: session?.user.id },
        {
          $and: [{ privacy: "friend" }, { creator: { $in: currentFriendIds } }],
        }, // Include private posts only if friend
      ],
    })
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
      { posts: friendPosts, counts: friendPostCount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for user friend posts" },
      { status: 500 }
    );
  }
};
