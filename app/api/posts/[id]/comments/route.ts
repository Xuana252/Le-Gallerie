import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@models/commentModel";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const comments = await Comment.find({ post: params.id })
      .populate({
        path: "user",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate({ path: "post", select: "_id" })
      .sort({ createdAt: -1 });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch for post comment", error);
    return NextResponse.json(
      { message: "Failed to fetch for post comment" },
      { status: 500 }
    );
  }
};
