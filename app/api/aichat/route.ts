import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AiChatBox from "@models/aiChatBoxModel";
import { connectToDB } from "@utils/database";

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

    Be nice to the user

    Answer in the user's language
    
    If a user asks something unrelated (e.g., programming, health, news, math), kindly let them know you're only here to discuss topics related to photography, art, and using the platform.`,
        },
      ],
    };

    const formattedMessages = [
      systemInstruction,
      {
        role: message.role,
        parts: [{ text: message.content }],
      },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: formattedMessages,
    });

    await connectToDB();

    const reply = result.response.text().replaceAll("**", "");

    let chat = await AiChatBox.findOne({ chatId: userId });

    if (!chat) {
      chat = new AiChatBox({
        chatId: userId,
        messages: [],
      });
    }

    // Thêm tin nhắn của user vào lịch sử chat
    chat.messages.push({
      senderId: "user",
      text: message.content,
      createdAt: Date.now(),
    });

    // Thêm phản hồi của AI vào lịch sử chat
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
