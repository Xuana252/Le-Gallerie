import { connectToDB } from "@utils/database";
import Post from "@models/postModels";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const GET = async (
  req: NextApiRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    const posts = await Post.find({ creator: params.id }).populate({
      path: "creator",
      select: "_id username email bio image"
    }).populate('categories');

    return NextResponse.json(posts,{status:200})
  } catch (error) {
    return NextResponse.json({message:'Failed to fetch for user post'},{status:500})
  }
};
