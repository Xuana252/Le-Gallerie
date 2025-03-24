import CommentLike from "@models/commentLikeModel";
import Like from "@models/likesModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    const likes = await Like.find({ user: params.id }).populate({
      path: "post",
      select: "creator categories",
      populate: { path: "categories" },
    });

    return NextResponse.json(
      { likes: likes, counts: likes.length },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users likes", error);
    return NextResponse.json(
      { message: "Failed to fetch for users likes" },
      { status: 500 }
    );
  }
};
