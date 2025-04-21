import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { options } from "@app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { checkFriendState } from "@actions/friendActions";
import { UserRole } from "@enum/userRolesEnum";

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

    // Privacy filter
    let privacyFilter: any[] = [{ privacy: "public" }];

    const isAdmin = session?.user.role?.includes(UserRole.ADMIN);
    const isSelf = session?.user.id === params.id;

    if (isAdmin || isSelf) {
      // Admins or profile owners can see all posts
      privacyFilter = [{ privacy: { $exists: true } }];
    } else if (friendState === FriendState.FRIEND) {
      // Friends can also see friend-only posts
      privacyFilter.push({ privacy: "friend" });
    }

    const skip = (page - 1) * limit;

    // Query posts
    const query = {
      $and: [
        { creator: params.id },
        { isDeleted: false },
        { $or: privacyFilter },
      ],
    };

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
