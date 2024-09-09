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

    
    const newComment = new Comment({
      post: post,
      parent: parent ? parent : null,
      user: user,
      content: content,
      likes: 0,
    });

    await newComment.save();

    const originalPost = await Post.findById(post)

    const promises = [
      // Always include the post-comment trigger
      knock.workflows.trigger("post-comment", {
        actor: user,
        data: {
          postId: post,
          commentId: newComment,
        },
        recipients: [
          {
            id: originalPost.creator._id.toString(),
            name: originalPost.creator.username,
            email: originalPost.creator.email,
            avatar: originalPost.creator.image || null,
          },
        ],
      }),
    ];

    // Conditionally include the comment-reply trigger
    if (parent) {
      promises.push(
        knock.workflows.trigger("comment-reply", {
          actor: user,
          data: {
            postId: post,
            parentId: parent,
            replyId: newComment,
          },
          recipients: [
            {
              id: originalPost.creator._id.toString(),
              name: originalPost.creator.username,
              email: originalPost.creator.email,
              avatar: originalPost.creator.image || null,
            },
          ],
        })
      );
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
