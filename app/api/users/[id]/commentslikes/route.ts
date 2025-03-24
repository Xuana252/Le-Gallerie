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

    const likes = await CommentLike.find({ user: params.id });

    return NextResponse.json(
      { commentLikes: likes, counts: likes.length },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users comment likes", error);
    return NextResponse.json(
      { message: "Failed to fetch for users comment likes" },
      { status: 500 }
    );
  }
};
