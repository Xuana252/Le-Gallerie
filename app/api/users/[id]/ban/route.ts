import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
import { knock } from "@lib/knock";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { getServerSession } from "next-auth";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const session = await getServerSession(options);


    if (!session?.user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (!session.user.role?.includes(UserRole.ADMIN))
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const updateUser = await User.findById(params.id);
    if (!updateUser)
      return NextResponse.json(
        { message: "User to update not found" },
        { status: 404 }
      );

    if (updateUser.banned) {
      updateUser.banned = false;
    } else {
      updateUser.banned = true;
      await knock.workflows.trigger("ban-user", {
        actor: process.env.NEXT_PUBLIC_ADMIN_ID,
        recipients: [
          {
            id: updateUser._id.toString(),
            name: updateUser.username,
            email: updateUser.email,
            avatar: updateUser.image || null,
          },
        ],
      });
    }

    await updateUser.save();

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update user ban state" },
      { status: 500 }
    );
  }
};
