import { connectToDB } from "@utils/database";
import { knock } from "@lib/knock";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'
import User from "@models/userModel";


export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
    try {

        await connectToDB()

        const userToBeVerified = await User.findById(params.id)
        
        if(!userToBeVerified) 
          return NextResponse.json({message:'user not found'},{status:404})

        const verificationCode = Math.floor(100000 + Math.random() * 900000)

        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'notfuny4927@gmail.com', // Your Gmail address
            pass: process.env.NODEMAILER_APP_PASSWORD, // Your App Password from Google
          },
        });
    
        // Set up email data
        let mailOptions = {
          from: 'notfuny4927@gmail.com',
          to: userToBeVerified.email, // recipient email
          subject: 'Verify user',
          text: `Hello ${userToBeVerified.username},

Your verification request has been accepted. Please use the code below to verify your account:

Verification Code: ${verificationCode}

Best regards,
From the Le Gallerie team.
`
        };
    
        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(verificationCode,{status:200})
    } catch (error) {
        return NextResponse.json({message:'failed to send verification'},{status:500})
    }
};
