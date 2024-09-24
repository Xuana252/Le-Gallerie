import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import Like from "@models/likesModel";

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

    const likedPostsIds = await Like.find({ user: params.id }).select("post");

    const postIds = likedPostsIds.map((postId) => postId.post.toString());

    const likedPosts = await Post.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id creator title categories description image likes")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    return NextResponse.json(likedPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch for user liked posts" },
      { status: 500 }
    );
  }
};
