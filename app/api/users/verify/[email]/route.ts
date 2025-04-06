import { connectToDB } from "@utils/database";
import { knock } from "@lib/knock";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@models/userModel";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    await connectToDB();

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_APP_EMAIL, // Your Gmail address
        pass: process.env.NODEMAILER_APP_PASSWORD, // Your App Password from Google
      },
    });

    const user = await User.findOne({ email: params.email });

    let emailSubject, emailBody;
    if (user) {
      emailSubject = "Verify Your Account";
      emailBody = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">Hello ${user.username},</h2>
          <p>Your verification request has been accepted. Use the code below to verify your account:</p>
          <h3 style="background: #007bff; color: #fff; padding: 10px 20px; display: inline-block; border-radius: 5px;">
            ${verificationCode}
          </h3>
          <p>Best regards,<br>Le Gallerie Team</p>
        </div>
      `;
    } else {
      emailSubject = "Complete Your Sign-Up";
      emailBody = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">Welcome to Le Gallerie!</h2>
          <p>We noticed you're signing up. Use the code below to verify your email:</p>
          <h3 style="background: #28a745; color: #fff; padding: 10px 20px; display: inline-block; border-radius: 5px;">
            ${verificationCode}
          </h3>
          <p>Best regards,<br>Le Gallerie Team</p>
        </div>
      `;
    }

    let mailOptions = {
      from: `"Le-Gallerie Team" <${process.env.NODEMAILER_APP_EMAIL}>`,
      to: params.email,
      subject: emailSubject,
      html: emailBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        id: user?._id.toString()||"",
        code: verificationCode.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to send verification" },
      { status: 500 }
    );
  }
};
