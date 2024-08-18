import Like from "@models/likesModels";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest,{params}:{params:{ id: string,postId:string }})=>{
    try {
        await connectToDB()
        
        const hasLiked = await Like.findOne({user:params.id,post:params.postId})
        
        if(!hasLiked) 
            return NextResponse.json({liked:false},{status:200})
        return NextResponse.json({liked:true},{status:200})
    } catch (error) {
        console.log('Failed to check if user has liked post',error)
        return NextResponse.json({message:'Failed to check if user has liked post'},{status:500})
    }
}