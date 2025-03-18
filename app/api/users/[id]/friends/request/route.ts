import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const request = Friend.find({
      $and: [{ user2: params.id }, { state: FriendState.PENDING }],
    }).populate({path:"user1",select: "-email -password -createdAt -updatedAt -__v"});

    return NextResponse.json({ request: request }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Failed to fetch friend request" },
      { status: 500 }
    );
  }
};
