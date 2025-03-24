import { FriendState } from "@enum/friendStateEnum";
import Follow from "@models/followModel";
import Friend from "@models/friendModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const friends = await Friend.find({
      state: FriendState.FRIEND,
      $or: [{ user1: params.id }, { user2: params.id }],
    }).populate({
      path: "user1 user2",
      select: "-email -password -createdAt -updatedAt -__v",
    });
    const users = friends.map((friend) =>
        friend.user1._id.toString() === params.id ? friend.user2 : friend.user1
      );
    return NextResponse.json(
      { users: users, length: users.length },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch for users friends", error);
    return NextResponse.json(
      { message: "Failed to fetch for users friends" },
      { status: 500 }
    );
  }
};
