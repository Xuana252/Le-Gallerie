import { FriendState } from "@enum/friendStateEnum";
import { knock } from "@lib/knock";
import Friend from "@models/friendModel";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { userId1, userId2 } = await req.json();

    const user1 = await User.findById(userId1);
    if (!user1) {
      console.log("User  not found");
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const user2 = await User.findById(userId2);
    if (!user2) {
      console.log("User  not found");
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const friend = await Friend.findOne({
      $or: [
        { user1: userId1, user2: userId2 },
        { user1: userId2, user2: userId1 },
      ],
    });

    if (friend) {
      if (
        friend.state === FriendState.PENDING &&
        friend.user2.toString() === userId1
      ) {
        friend.state = FriendState.FRIEND;
        await friend.save();
        await knock.workflows.trigger("accept-friend", {
          actor: userId1,
          data: {
            userId: userId1,
          },
          recipients: [
            {
              id: user2._id.toString(),
              name: user2.username,
              email: user2.email,
              avatar: user2.image || null,
            },
          ],
        });
      }

      return NextResponse.json(
        { message: "Friend state updated" },
        { status: 200 }
      );
    } else {
      const friend = await Friend.create({
        user1: userId1,
        user2: userId2,
        state: FriendState.PENDING,
      });

      await knock.workflows.trigger("friend-request", {
        actor: userId1,
        data: {
          userId: userId1,
        },
        recipients: [
          {
            id: user2._id.toString(),
            name: user2.username,
            email: user2.email,
            avatar: user2.image || null,
          },
        ],
      });
      return NextResponse.json({ message: "Friend created" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update friend state" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { userId1, userId2 } = await req.json();

    await Friend.findOneAndDelete({
      $or: [
        { user1: userId1, user2: userId2 },
        { user1: userId2, user2: userId1 },
      ],
    });

    return NextResponse.json(
      { message: "Friend deleted" },
      { status: 200 }
    )
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to delete friend" },
      { status: 500 }
    );
  }
};
