import Comment from "@models/commentModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const comment = await Comment.findById(params.id).populate({
      path: "user",
      select: "-email -password -createdAt -updatedAt -__v",
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 400 }
      );
    }
    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch for comment" },
      { status: 500 }
    );
  }
};
