import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { generateAndUpsertEmbedding, getPineconeClient } from "@lib/pinecone";
import Category from "@models/categoryModel";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { creator, title, description, categories, image, privacy } =
    await req.json();

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

    const postId = newPost._id.toString();

    await generateAndUpsertEmbedding(postId, title, description, categories);

    return NextResponse.json(newPost, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create new post" },
      { status: 500 }
    );
  }
};
