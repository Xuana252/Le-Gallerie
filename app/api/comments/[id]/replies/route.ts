import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@models/commentModel";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
    try {
        await connectToDB()

        const replies = await Comment.find({parent:params.id})
        .populate({ path: "user", select: "-email -password -createdAt -updatedAt -__v" })
        .populate({ path: "post", select: "_id"})

        return NextResponse.json(replies,{status:200})
    } catch(error) {
        console.log('Failed to fetch for comment replies',error)
        return NextResponse.json(
            { message: "Failed to fetch for comment replies" },
            { status: 500 }
          );
    }
};