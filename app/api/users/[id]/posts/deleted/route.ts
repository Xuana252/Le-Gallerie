import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
import CommentLike from "@models/commentLikeModel";
import Comment from "@models/commentModel";
import Like from "@models/likesModel";
import Post from "@models/postModel";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  try {
    connectToDB();

    const skip = (page - 1) * limit;

    const session = await getServerSession(options);


    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const query = {
      $and: [{ creator: params.id }, { isDeleted: true }]
    };

    const postsCount = await Post.countDocuments(query);
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

    return NextResponse.json(
      { posts: posts, counts: postsCount },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users deleted posts ", error);
    return NextResponse.json(
      { message: "Failed to fetch for users deleted posts" },
      { status: 500 }
    );
  }
};
