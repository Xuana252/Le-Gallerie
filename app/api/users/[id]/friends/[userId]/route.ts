import { FriendState } from "@enum/friendStateEnum";
import Follow from "@models/followModel";
import Friend from "@models/friendModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) => {
  try {
    await connectToDB();

    const friend = await Friend.findOne({
      $or: [
        { user1: params.userId, user2: params.id },
        { user1: params.id, user2: params.userId },
      ],
    });

    if (!friend) {
      return NextResponse.json(
        { state: FriendState.UNFRIEND },
        { status: 200 }
      );
    }

    if (friend.state === FriendState.PENDING) {
      return NextResponse.json(
        {
          state:
            friend.user1.toString() === params.id
              ? FriendState.SENT
              : FriendState.PENDING,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ state: FriendState.FRIEND }, { status: 200 });
  } catch (error) {
    console.error("Failed to check friend state", error);
    return NextResponse.json(
      { message: "Failed to check friend state" },
      { status: 500 }
    );
  }
};
