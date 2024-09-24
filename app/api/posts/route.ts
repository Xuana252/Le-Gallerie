import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id creator title categories description image likes")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    return Response.json(posts, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};
