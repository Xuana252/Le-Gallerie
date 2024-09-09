import { connectToDB } from "@utils/database";
import Follow from "@models/followModel";
import { NextRequest, NextResponse } from "next/server";
import User from "@models/userModel";
import { knock } from "@lib/knock";

export const GET = async (req:NextRequest,{params}:{params:{ id: string }})=>{
    try {
        await connectToDB()

        const followings = await Follow.find({follower:params.id}).populate({ path: "user", select: "_id username bio image follower following" })
        const users = followings.map(following=>following.user)
        return NextResponse.json({users:users,length:users.length},{status:200})
    } catch(error) {
        console.log('Failed to fetch for users following',error)
        return NextResponse.json(
            { message: "Failed to fetch for users following" },
            { status: 500 }
          );
    }
}

export const PATCH = async (req:NextRequest,{params}:{params:{ id: string }})=>{
    const {userId} = await req.json();
    try {
        await connectToDB();
        const user = await User.findById(params.id)
        const follower = await User.findById(userId)
        const userIsFollowed = await Follow.findOne({user:params.id,follower:userId})
        if(userIsFollowed) {
            await Follow.findOneAndDelete({user:params.id,follower:userId})
            user.follower-=1
            follower.following-=1
        } else {
            await Follow.create({
                user:params.id,
                follower:userId,
            })
            await knock.workflows.trigger('user-follow',{
              actor: userId,
              data: {
                userId: userId,
              },
              recipients: [
                {
                  id:user._id.toString(),
                  name:user.username,
                  email:user.email,
                  avatar:user.image||null,
                }
              ]
            })
            user.follower+=1
            follower.following+=1
        }
        await user.save();
        await follower.save();
        return NextResponse.json(
          { message: "user follower updated", likes: user.follower },
          { status: 200 }
        );
      } catch (error) {
        console.log("Failed to update user follower", error);
        return NextResponse.json(
          { message: "Failed to update user follower" },
          { status: 500 }
        );
      }
}