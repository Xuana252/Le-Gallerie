import Like from "@models/likesModel";
import Post from "@models/postModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      await connectToDB();
      const post = await Post.findByIdAndUpdate(params.id,{isDeleted:false});
      if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Post revived" }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "failed to revive post" },
        { status: 500 }
      );
    }
  };