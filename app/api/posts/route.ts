import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const skip = (page - 1) * limit;

    const posts = await Post.find({
     creator: {
      $nin: currentUser?.blocked 
     },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id creator title categories description image likes createdAt")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories"); 

    return Response.json({posts:posts,counts:0}, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};
