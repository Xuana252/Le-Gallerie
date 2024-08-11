import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import User from "@models/userModel";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  
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
