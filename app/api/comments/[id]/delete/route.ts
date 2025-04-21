import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";
import Like from "@models/likesModel";
import Post from "@models/postModel";
import Report from "@models/reportModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const commentId = params.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    const childComments = await Comment.find({ parent: commentId });

    const childCommentIds = childComments.map((child) => child._id);


    if (childCommentIds.length > 0) {
      await CommentLike.deleteMany({ commentId: { $in: childCommentIds } });
    }


    await Comment.deleteMany({ parent: commentId });

   
    await CommentLike.deleteMany({ comment: commentId });

    await Comment.findByIdAndDelete(commentId);

    await Report.deleteMany({reportId: commentId,type: "Comment"})


    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to delete comment" },
      { status: 500 }
    );
  }
};
