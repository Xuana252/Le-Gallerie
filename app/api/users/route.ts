import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchText = searchParams.get("searchText") || "";

  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id);

    const skip = (page - 1) * limit;

    // Build the query object
    const query: any = {
      _id: {
        $nin: currentUser?.blocked,
      },
    };

    if (searchText) {
      // Build the $or query
      query.$or = [
        { username: { $regex: searchText, $options: "i" } },
        { fullname: { $regex: searchText, $options: "i" } },
      ];
    } else {
      return Response.json({ users: [], counts: 0 }, { status: 400 });
    }

    const count = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-email -password -createdAt -updatedAt -__v")
      .skip(skip)
      .limit(limit);

    return Response.json({ users: users, counts: count }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "failed to fetch for users" },
      { status: 500 }
    );
  }
};
