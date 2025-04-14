import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { creator, title, description, categories, image,privacy } = await req.json();

  try {
    await connectToDB();

    const newPost = new Post({
      creator: creator,
      title: title,
      description: description,
      categories: categories,
      image: image,
      likes: 0,
      privacy: privacy,
      isDeleted: false,
    });

    await newPost.save();

    return NextResponse.json(newPost, { status: 200 });
  } catch (error) {

    return NextResponse.json({message: 'Failed to create new post'},{status:500})
  }
};
