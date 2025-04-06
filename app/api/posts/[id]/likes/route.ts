import Post from "@models/postModel";
import Like from "@models/likesModel";
import User from "@models/userModel";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
import { Knock } from "@knocklabs/node";

const knock = new Knock(process.env.KNOCK_API_SECRET);

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
    try {
        await connectToDB()

        const postLikes = await Like.find({post:params.id}).populate({ path: "user", select: "-email -password -createdAt -updatedAt -__v" })
        return NextResponse.json(postLikes,{status:200})
    } catch(error) {
        console.log('Failed to fetch for post likes',error)
        return NextResponse.json(
            { message: "Failed to fetch for post likes" },
            { status: 500 }
          );
    }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const {userId,reaction} = await req.json();
  console.log(reaction)
  try {
    await connectToDB();

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 400 });
    }
    const liked = await Like.findOne({post:params.id,user:userId})
    const creator = await User.findById(post.creator)

    if (liked) {
      if(liked.reaction === reaction) {
        await Like.findOneAndDelete({ post: params.id, user: userId });
        post.likes -= 1;
      } else {
        liked.reaction = reaction;
        await liked.save()
      }
    } else {
      const like = await Like.create({ post: params.id, user: userId,reaction:reaction });
      console.log(like)
      post.likes += 1;
      if(userId!==post.creator._id.toString()) {
        await knock.workflows.trigger('post-like',{
          actor: userId,
          data: {
            postId: post._id,
          },
          recipients: [
            {
              id:creator._id.toString(),
              name:creator.username,
              email:creator.email,
              avatar:creator.image||null,
            }
          ]
        })
      }
    }

    await post.save();
    return NextResponse.json(
      { message: "Post likes updated", likes: post.likes },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update post likes", error);
    return NextResponse.json(
      { message: "Failed to update post's likes" },
      { status: 500 }
    );
  }
};
