import { Reaction } from "@enum/reactionEnum";
import Like from "@models/likesModel";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const reactionCounts = await Like.aggregate([
      { $match: { post: new ObjectId(params.id) } },
      {
        $group: {
          _id: "$reaction",
          count: { $sum: 1 },
        },
      },
    ]);



    const summary: Record<Reaction, number> = {
      [Reaction.LIKE]: 0,
      [Reaction.LOVE]: 0,
      [Reaction.HAHA]: 0,
      [Reaction.SAD]: 0,
      [Reaction.WOW]: 0,
      [Reaction.ANGRY]: 0,
    };
    for (const reaction of reactionCounts) {
      summary[reaction._id as Reaction] = reaction.count;
    }

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("Failed to summarize post likes", error);
    return NextResponse.json(
      { message: "Failed to summarize post likes" },
      { status: 500 }
    );
  }
};
