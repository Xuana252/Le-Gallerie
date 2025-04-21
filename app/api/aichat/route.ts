import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AiChatBox from "@models/aiChatBoxModel";
import { connectToDB } from "@utils/database";
import Post from "@models/postModel";
import { queryPosts } from "@lib/pinecone";
import { PostPrivacy } from "@enum/postPrivacyEnum";

export async function POST(req: Request) {
  try {
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

    const { userId, message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ!" },
        { status: 400 }
      );
    }

    const systemInstruction = {
      role: "user",
      parts: [
        {
          text: `You are an assistant for Le-Gallerie, a social media app focused on photography, image sharing, and visual arts. 
    You only answer questions related to:
    - Art and photography tips, techniques, tools, styles, and history.
    - Creative inspiration related to visual arts.


    Answer in the user's language
    
    If a user asks something unrelated (e.g., programming, health, news, math), kindly let them know you're only here to discuss topics related to photography, art, and using the platform.`,
        },
      ],
    };

    await connectToDB();

    const postIds = await queryPosts( message.content)

    const posts = await Post.find({_id: {$in: postIds}})
      .populate({
        path: "creator",
        select: "-email -password -createdAt -updatedAt -__v",
      })
      .populate("categories")
      .sort({ createdAt: -1 });

    const postsInfo = posts
      .map((post) => {
        const creatorName = post.creator?.username || "Unknown Creator";
        const creatorRoles = post.creator?.roles?.join(", ") || "No roles";
        const categories =
          post.categories.map((cat: any) => cat.name).join(", ") ||
          "Uncategorized";

        return `Post:
- Id: ${post._id}
- Title: ${post.title}
- Description: ${post.description}
- Categories: ${categories}
- Creator: ${creatorName}
- Creator Roles: ${creatorRoles}
- Created At: ${post.createdAt.toISOString()}`;
      })
      .join("\n\n");

    // Create a special context message
    const postsContext = {
      role: "user",
      parts: [
        {
          text: `Here is the list of posts you can recommend:\n\n${postsInfo}\n\nWhen a user asks for post recommendations, suggest from these. and return post as ${
            process.env.NEXT_PUBLIC_DOMAIN_NAME || "http://localhost:3000"
          }/post/[postId] WITHOUT adding any punctuation after the URL (no period, comma, etc). Only use plain URL, no extra text after.`,
        },
      ],
    };

    let chat = await AiChatBox.findOne({ chatId: userId , isDeleted: false , privacy: PostPrivacy.PUBLIC });

    if (!chat) {
      chat = new AiChatBox({
        chatId: userId,
        messages: [],
      });
    }

    const historyMessages = chat.messages.map((msg: any) => ({
      role: msg.senderId === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const formattedMessages = [
      systemInstruction,
      postsContext,
      ...historyMessages,
      {
        role: message.role,
        parts: [{ text: message.content }],
      },
    ];

    // 5. Then call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: formattedMessages,
    });

    const reply = result.response.text().replaceAll("**", "");

    chat.messages.push({
      senderId: "user",
      text: message.content,
      createdAt: Date.now(),
    });

    chat.messages.push({
      senderId: "gemini-ai",
      text: reply,
      createdAt: Date.now() + 5 * 1000,
    });

    if (chat.messages.length > 30) {
      chat.messages = chat.messages.slice(chat.messages.length - 30);
    }

    await chat.save();

    return NextResponse.json({ reply: reply });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Lỗi khi gọi API AI" }, { status: 500 });
  }
}
