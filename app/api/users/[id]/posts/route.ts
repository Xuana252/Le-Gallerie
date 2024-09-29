import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const counts = await Post.countDocuments({ creator: params.id })
    const posts = await Post.find({ creator: params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id creator title categories description image likes")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    return NextResponse.json({posts:posts,counts:counts}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch for user post" },
      { status: 500 }
    );
  }
};
