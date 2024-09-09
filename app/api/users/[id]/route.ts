import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { knock } from "@lib/knock";

export const PATCH = async (req:Request,{params}:{params:{id:string}}) => {
    const {username,image,bio} = await req.json()
    try {
        connectToDB()
        const updateInfo = {
            username: username,
            image: image, 
            bio: bio,
        }
        const user = await User.findByIdAndUpdate(params.id,updateInfo,{new:true})
        await knock.users.identify(params.id,{
            name:username,
            avatar:image?image:null,
          })
        if(!user)
            return NextResponse.json({message: 'User not found'},{status:404})
        return NextResponse.json({message: "User updated successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:'Failed to update user'},{status:500})
    }
}

export const GET =async (req:Request,{params}:{params:{id:string}}) => { 
    try {
        connectToDB()

        const user = await User.findById(params.id).select("_id username bio image")
        if(!user)
            return NextResponse.json({message: 'User not found'},{status:404})
        return NextResponse.json(user,{status:200})
    } catch (error) {
        return NextResponse.json({message:'Failed to fetch user'},{status:500})
    }
}