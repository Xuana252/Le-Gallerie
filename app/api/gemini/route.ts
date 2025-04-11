import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("🔴 GOOGLE_GEMINI_API_KEY không được định nghĩa!");
  throw new Error("GOOGLE_GEMINI_API_KEY không được định nghĩa!");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {

    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ!" }, { status: 400 });
    }

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 
    const result = await model.generateContent({
      contents: formattedMessages,
    });

   
    return NextResponse.json({ reply: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi gọi API AI" }, { status: 500 });
  }
}


