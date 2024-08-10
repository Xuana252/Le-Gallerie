import { connectToDB } from "@utils/database";
import Post from "@models/postModels";

export const GET  = async () => {
    try {
        await connectToDB
        const posts = await Post.find({}).populate('creator')
        return Response.json(posts,{status:200})
    } catch (error) {
        return Response.json({message: 'failed to fetch for post'},{status:500})
    }
}