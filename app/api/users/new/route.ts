import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import bcrypt from "bcrypt";
import { NextApiRequest } from "next";
import { db } from "@lib/firebase";
import { setDoc,doc } from "firebase/firestore";
import { knock } from "@lib/knock";

export const POST = async (req: NextRequest) => {
  
  try {
    const { username, email, password, image } = await req.json();
    await connectToDB();
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return NextResponse.json(
        { message: "An account with that email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      image,
      bio: '',
      follower:0,
      following:0,
    });

    const knockUser = await knock.users.identify(newUser._id.toString(),{
      name:username,
      email:email,
      avatar:image||null,
    })

    await setDoc(doc(db, 'usersChat', newUser._id.toString()), {
      chat: []
    });

    return NextResponse.json({message: 'Account created successfully!!!'}, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: "Failed to create new account" },
      { status: 500 }
    );
  }
};
