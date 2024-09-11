import { Knock } from "@knocklabs/node";
import Comment from "@models/commentModel";
import Post from "@models/postModel";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";

const knock = new Knock(process.env.KNOCK_API_SECRET);

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { content, parent, post, user } = await req.json();

  try {
    await connectToDB();

    var repliedComment = null;

    if (parent) {
      repliedComment = await Comment.findById(parent);
    }

    var finalParent = !repliedComment
      ? null
      : repliedComment.parent
      ? repliedComment.parent
      : repliedComment;

    const newComment = new Comment({
      post: post,
      parent: finalParent,
      user: user,
      content: content,
      likes: 0,
    });

    const originalPost = await Post.findById(post);

    await newComment.save();

    const promises = [
      // Always include the post-comment trigger
    ];

    if (originalPost.creator.toString() !== user) {
      promises.push(
        knock.workflows.trigger("post-comment", {
          actor: user,
          data: {
            postId: post,
            commentId: newComment._id,
          },
          recipients: [
            {
              id: originalPost.creator.toString(),
            },
          ],
        })
      );
    }

    // Conditionally include the comment-reply trigger
    if (repliedComment) {
      console.log(repliedComment.user);
      if (repliedComment.user.toString() !== user) {
        promises.push(
          knock.workflows.trigger("comment-reply", {
            actor: user,
            data: {
              postId: post,
              parentId: finalParent._id,
              replyId: newComment._id,
            },
            recipients: [
              {
                id: repliedComment.user.toString(),
              },
            ],
          })
        );
      }
    }

    // Wait for all promises to complete
    await Promise.all(promises);

    return NextResponse.json(
      { message: "create new comment successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to create post comment", error);
    return NextResponse.json(
      { message: "Failed to create post comment" },
      { status: 500 }
    );
  }
};
