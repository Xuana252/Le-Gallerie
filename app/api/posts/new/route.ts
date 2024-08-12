import { connectToDB } from "@utils/database";
import Post from "@models/postModels";

export const POST = async (req: Request, res: Response) => {
  const { creator, title, description, categories, image } = await req.json();

  try {
    await connectToDB();

    const newPost = new Post({
      creator: creator,
      title: title,
      description: description,
      categories: categories,
      image: image,
    });

    await newPost.save();

    return Response.json(newPost, { status: 200 });
  } catch (error) {

    return Response.json({message: 'Failed to create new post'},{status:500})
  }
};
