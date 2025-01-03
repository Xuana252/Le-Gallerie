import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import Like from "@models/likesModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const post = await Post.findById(params.id)
      .select("_id creator title categories description image likes createdAt")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (currentUser&&(currentUser.blocked.includes(post.creator._id.toString())||post.creator.blocked.includes(currentUser._id.toString()))) {
      return NextResponse.json(
        { message: "Post not available" },
        { status: 403 }
      );
    } else {
      return NextResponse.json(post, { status: 200 });
    }

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { image, categories, title, description } = await req.json();
  try {
    await connectToDB();
    const updatedPost = {
      image: image,
      categories: categories,
      title: title,
      description: description,
    };
    const post = await Post.findByIdAndUpdate(params.id, updatedPost, {
      new: true,
    });
    if (post) {
      return NextResponse.json(post, { status: 200 });
    }
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update post" },
      { status: 500 }
    );
  }
};

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

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to delete post" },
      { status: 500 }
    );
  }
};
