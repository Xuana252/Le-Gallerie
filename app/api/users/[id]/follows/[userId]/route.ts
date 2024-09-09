import { connectToDB } from "@utils/database";
import Follow from "@models/followModel";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest,{params}:{params:{ id: string,userId:string }})=>{
    try {
        await connectToDB()

        const hasFollowed = await Follow.findOne({user:params.userId,follower:params.id})
        if(!hasFollowed) 
            return NextResponse.json({followed:false},{status:200})
        return NextResponse.json({followed:true},{status:200})
    } catch (error) {
        console.log('Failed to check if user has followed',error)
        return NextResponse.json({message:'Failed to check if user has followed'},{status:500})
    }
}