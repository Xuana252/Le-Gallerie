import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";
import Like from "@models/likesModel";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const post = await Post.findByIdAndDelete(params.id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    await Like.deleteMany({ post: params.id });

    const comments = await Comment.find({ post: params.id }).select("_id");

    const commentIds = comments.map((comment) => comment._id);

  
    await CommentLike.deleteMany({ comment: { $in: commentIds } });

    await Comment.deleteMany({ post: params.id });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to delete post" },
      { status: 500 }
    );
  }
};
