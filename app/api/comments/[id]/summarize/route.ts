import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AiChatBox from "@models/aiChatBoxModel";
import { connectToDB } from "@utils/database";
import Comment from "@models/commentModel";
import { options } from "@app/api/auth/[...nextauth]/options";
import { UserRole } from "@enum/userRolesEnum";
import { getServerSession } from "next-auth";
import Post from "@models/postModel";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();

    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session?.user.role?.includes(UserRole.ADMIN);

    const post = await Comment.findOne({
      _id: params.id,
      ...(isAdmin ? {} : { user: session.user.id }),
    });

    if (!post) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        {
          message: "Service unavailable",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const comments = await Comment.find({ parent: params.id }).select("content");

    if (!comments.length) {
      return NextResponse.json(
        { message: "No replies found for this comment." },
        { status: 404 }
      );
    }

    const commentCount = comments.length;

    const commentListToSummarize = comments
      .map((c) => `- ${c.content}`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an assistant for Le-Gallerie, a social media app focused on photography and visual arts. Summarize the following user replies opinions in a friendly and concise way:\n\n${commentListToSummarize}. And keep it brief and just return the summary and nothing else`,
            },
          ],
        },
      ],
    });

    const reply = result.response.text();

    return NextResponse.json({ message: reply , counts: commentCount }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Lỗi khi gọi API AI" }, { status: 500 });
  }
}
