import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { knock } from "@lib/knock";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { username, image, bio, fullname, birthdate } = await req.json();
  try {
    connectToDB();
    const updateInfo = {
      username: username,
      image: image,
      bio: bio,
      fullname: fullname,
      birthdate: birthdate,
    };
    const user = await User.findByIdAndUpdate(params.id, updateInfo, {
      new: true,
    });
    await knock.users.identify(params.id, {
      name: username,
      avatar: image ? image : null,
    });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDB();

    await connectToDB();
    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const isAdmin = currentUser && currentUser.role.includes("admin");

    const user = await User.findById(params.id).select(
      isAdmin
        ? "-password   -__v" // Include email for admin
        : "-email -password  -updatedAt -__v" // Hide email for others
    );
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // if (
    //   !!session?.user.blocked?.find((userId: string) => userId == user._id) ||
    //   !!user.blocked?.find((userId: string) => userId == session?.user.id)
    // )
    //   return NextResponse.json({ message: "Blocked" }, { status: 400 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
};
