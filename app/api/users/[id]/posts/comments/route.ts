import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    const posts = await Post.find({ creator: params.id, isDeleted: false });

    const postIds = posts.map((post) => post._id);

    const comments = await Comment.find({ post: { $in: postIds } });

    return NextResponse.json(
      { comments: comments, counts: comments.length },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users posts comments", error);
    return NextResponse.json(
      { message: "Failed to fetch for users posts comments" },
      { status: 500 }
    );
  }
};
