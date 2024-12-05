import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { getServerSession } from "next-auth";
import { options } from "@app/api/auth/[...nextauth]/options";
import User from "@models/userModel";


export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const searchText = searchParams.get("searchText") || "";

  try {
    await connectToDB();

    const session = await getServerSession(options);

    const currentUser = await User.findById(session?.user.id)

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
        { fullname: {  $regex: searchText, $options: "i" } },
      ];
    } else {
        return Response.json({ users: [] , counts: 0 }, { status: 400 });
    }

    // Step 3: Filter by category IDs if any
    const count = await User.countDocuments(query);
    console.log("Total matching users:", count);
    
    const users = await User.find(query).select("-email -password -createdAt -updatedAt -__v")

    return Response.json({ users: users, counts: count }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "failed to fetch for users" },
      { status: 500 }
    );
  }
};
