import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import Like from "@models/likesModel";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";
import { FriendState } from "@enum/friendStateEnum";
import Friend from "@models/friendModel";
import { PostPrivacy } from "@enum/postPrivacyEnum";
import { checkFriendState } from "@actions/friendActions";
import { UserRole } from "@enum/userRolesEnum";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);
    const isAdmin = currentUser?.role.includes(UserRole.ADMIN);

    const query: any = { _id: params.id };

    if (!isAdmin) {
      query.isDeleted = false;
    }

    const post = await Post.findOne(query)
      .select("-updatedAt -__v")
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories");

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (isAdmin) {
      return NextResponse.json(post, { status: 200 });
    }

    if (post.creator._id.toString() === session?.user.id) {
      return NextResponse.json(post, { status: 200 });
    }

    const isBlocked =
      currentUser &&
      (currentUser.blocked.includes(post.creator._id.toString()) ||
        post.creator.blocked.includes(currentUser._id.toString()));

    if (post.privacy === PostPrivacy.PRIVATE || isBlocked) {
      return NextResponse.json(
        { message: "Post not available" },
        { status: 403 }
      );
    }

    if (post.privacy === PostPrivacy.FRIEND) {
      const state = await checkFriendState(
        post.creator._id.toString(),
        session?.user.id || ""
      );
      if (state !== FriendState.FRIEND) {
        return NextResponse.json(
          { message: "Post not available" },
          { status: 403 }
        );
      } 
  
    }

    return NextResponse.json(post, { status: 200 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { image, categories, title, description, privacy } = await req.json();
  try {
    await connectToDB();
    const updatedPost = {
      image: image,
      categories: categories,
      title: title,
      description: description,
      privacy: privacy,
    };
    const post = await Post.findByIdAndUpdate(params.id, updatedPost, {
      new: true,
    });
    if (post) {
      return NextResponse.json(post, { status: 200 });
    }
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { message: "failed to update post" },
      { status: 500 }
    );
  }
};
