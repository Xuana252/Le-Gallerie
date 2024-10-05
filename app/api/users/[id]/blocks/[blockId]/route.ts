import User from "@models/userModel";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string; blockId: string } }
) => {
  try {
    await connectToDB();
    // Find the user who is performing the block/unblock
    const user = await User.findById(params.id);
    if (!user) {
      console.log("User performing the block not found");
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Find the user to be blocked/unblocked
    const blockUser = await User.findById(params.blockId);
    if (!blockUser) {
      console.log("User to be blocked/unblocked not found");
      return NextResponse.json(
        { message: "User to be blocked not found" },
        { status: 400 }
      );
    }

    const blockedIndex = user.blocked.findIndex((blockedUser: any) => {
      return blockedUser.toString() === params.blockId;
    });

    console.log(blockedIndex);

    if (blockedIndex !== -1) {
      // If already blocked, we will unblock the user
      user.blocked.splice(blockedIndex, 1);
      console.log("User unblocked successfully");
    } else {
      // If not blocked, we will block the user
      user.blocked.push(blockUser._id);
      console.log("User blocked successfully");
    }

    // Save the updated user data
    await user.save();

    return NextResponse.json(
      { message: "User block/unblock updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user blocked" },
      { status: 500 }
    );
  }
};


