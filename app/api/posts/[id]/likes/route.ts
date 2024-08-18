import Post from "@models/postModels";
import Like from "@models/likesModels";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
    try {
        await connectToDB()

        const postLikes = await Like.find({post:params.id})
        return NextResponse.json(postLikes,{status:200})
    } catch(error) {
        console.log('Failed to fetch for post likes',error)
        return NextResponse.json(
            { message: "Failed to fetch for post likes" },
            { status: 500 }
          );
    }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const {userId} = await req.json();
  try {
    await connectToDB();

    const post = await Post.findById(params.id);
    const liked = await Like.findOne({post:params.id,user:userId})

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 400 });
    }

    if (liked) {
      await Like.findOneAndDelete({ post: params.id, user: userId });
      post.likes -= 1;
    } else {
      const like = new Like({ post: params.id, user: userId });
      await like.save();
      post.likes += 1;
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
