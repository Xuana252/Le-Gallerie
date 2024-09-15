import { connectToDB } from "@utils/database";
import Post from "@models/postModel";

export const GET = async () => {
  try {
    await connectToDB;
    const posts = await Post.find({}).sort({ createdAt: -1 })
      .select("_id creator title categories description image likes")
      .populate({ path: "creator", select: "-email -password -createdAt -updatedAt -__v" })
      .populate("categories");
    return Response.json(posts, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "failed to fetch for post" },
      { status: 500 }
    );
  }
};
