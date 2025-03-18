import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
import { Knock } from "@knocklabs/node";
import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";

const knock = new Knock(process.env.KNOCK_API_SECRET);

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const commentLikes = await CommentLike.find({
      comment: params.id
    }).populate({
      path: "user",
      select: "-email -password -createdAt -updatedAt -__v",
    });

    return NextResponse.json(commentLikes, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch for comment likes", error);
    return NextResponse.json(
      { message: "Failed to fetch for comment likes" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { userId, reaction } = await req.json();
  try {
    await connectToDB();

    const comment = await Comment.findById(params.id);
    if (!comment) {
      return NextResponse.json(
        { message: "comment not found" },
        { status: 400 }
      );
    }

    const liked = await CommentLike.findOne({
      comment: params.id,
      user: userId,
    });

    if (liked) {
      if (liked.reaction === reaction) {
        await CommentLike.findOneAndDelete({
          comment: params.id,
          user: userId,
        });
        comment.likes -= 1;
      } else {
        liked.reaction = reaction;
        await liked.save();
      }
    } else {
      await CommentLike.create({ comment: params.id, user: userId ,reaction:reaction });
      comment.likes += 1;
      if (userId !== comment.user.toString()) {
        await knock.workflows.trigger("comment-like", {
          actor: userId,
          data: {
            postId: comment.post.toString(),
            commentId: params.id,
          },
          recipients: [
            {
              id: comment.user.toString(),
            },
          ],
        });
      }
    }

    await comment.save();
    return NextResponse.json(
      { message: "comment likes updated", likes: comment.likes },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update comment likes", error);
    return NextResponse.json(
      { message: "Failed to update comment likes" },
      { status: 500 }
    );
  }
};
