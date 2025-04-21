import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    const rawComments = await Comment.find({ user: params.id }).populate({
      path: "post",
      select: "creator categories isDeleted",
      populate: { path: "categories" },
    });
    
    const comments = rawComments.filter(comment => comment.post && !comment.post.isDeleted);

    return NextResponse.json(
      { comments: comments, counts: comments.length },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users comments", error);
    return NextResponse.json(
      { message: "Failed to fetch for users comments" },
      { status: 500 }
    );
  }
};
