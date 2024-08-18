import { connectToDB } from "@utils/database";
import Post from "@models/postModels";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    const posts = await Post.find({ creator: params.id })
      .select("_id creator title categories description image likes")
      .populate({
        path: "creator",
        select: "_id username email bio image",
      })
      .populate("categories");

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch for user post" },
      { status: 500 }
    );
  }
};