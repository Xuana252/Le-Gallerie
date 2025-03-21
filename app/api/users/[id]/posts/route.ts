import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { options } from "@app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { checkFriendState } from "@actions/friendActions";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    await connectToDB();

    const session = await getServerSession(options);

    const friendState = await checkFriendState(
      params.id,
      session?.user.id || ""
    );

    const skip = (page - 1) * limit;

    // Privacy filter
    const privacyFilter: any = [{ privacy: "public" }];
    if (session?.user.id === params.id) {
      privacyFilter.push({ privacy: { $exists: true } }); // Fetch all if user is viewing their own posts
    } else if (friendState === FriendState.FRIEND) {
      privacyFilter.push({ privacy: "friend" }); // Include friend-only posts
    }

    // Query posts
    const query = { creator: params.id, $or: privacyFilter };

    const counts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-updatedAt -__v")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    return NextResponse.json({ posts: posts, counts: counts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch for user post" },
      { status: 500 }
    );
  }
};
