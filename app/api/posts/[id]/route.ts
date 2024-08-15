import { connectToDB } from "@utils/database";
import Post from "@models/postModels";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export const GET = async (
  req: NextApiRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const post = await Post.findById(params.id).select('_id creator title categories description image')
      .populate({ path: "creator", select: "_id username bio image" })
      .populate("categories");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
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
      return NextResponse.json({ message: "Post updated" }, { status: 200 });
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
  req: NextApiRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const post = await Post.findByIdAndDelete(params.id, req.body);

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to delete post" },
      { status: 500 }
    );
  }
};
