import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
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

    updateUser.banned = !updateUser.banned;
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
