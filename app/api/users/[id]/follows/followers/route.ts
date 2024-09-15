import { connectToDB } from "@utils/database";
import Follow from "@models/followModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest,{params}:{params:{ id: string }})=>{
    try {
        await connectToDB()

        const followers = await Follow.find({user:params.id}).populate({ path: "follower", select: "-email -password -createdAt -updatedAt -__v" })
        const users = followers.map(follower=>follower.follower)
        return NextResponse.json({users:users,length:users.length},{status:200})
    } catch(error) {
        console.log('Failed to fetch for users followers',error)
        return NextResponse.json(
            { message: "Failed to fetch for users followers" },
            { status: 500 }
          );
    }
}