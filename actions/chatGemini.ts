"use server"

import AiChatBox, { AiChatBoxType } from "@models/aiChatBoxModel";
import { connectToDB } from "@utils/database";
import { v4 as uuidv4 } from "uuid";

export const getAIResponse = async (userMessage: string,userId:string|undefined) => {
  try {
    const response = await fetch(`${process.env.DOMAIN_NAME}/api/gemini`, {  // Đảm bảo đúng đường dẫn API
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: userMessage }] }),
    });

    const data = await response.json();

    const reply=data.reply.replaceAll("**",'')

    await connectToDB();

    let chat = await AiChatBox.findOne({ chatId: userId });

    if (!chat) {
      // Nếu chưa tồn tại, tạo mới
      chat = new AiChatBox({
        chatId: userId,
        messages: [],
      });
    }

     // Thêm tin nhắn của user vào lịch sử chat
     chat.messages.push({ senderId: "user", text: userMessage, createdAt: Date.now() });

     // Thêm phản hồi của AI vào lịch sử chat
     chat.messages.push({ senderId: "gemini-ai", text: reply, createdAt: Date.now()+5*1000 });
    
     console.log(data.reply)
     // Lưu lại vào database
     await chat.save();

    return reply || "Xin lỗi, tôi không hiểu.";
  } catch (error) {
    console.error("Lỗi khi gọi AI:", error);
    return "Xin lỗi, có lỗi xảy ra.";
  } 
};

export const getAiMessage = async (chatId: string | undefined) => {
  try {
    await connectToDB();

    const chatBox = await AiChatBox.findOne({ chatId }).select("messages.text messages.senderId messages.createdAt").lean<AiChatBoxType>();

    if (!chatBox || !chatBox.messages) {
      return [];
    }
    const messages = chatBox.messages.map((msg: any) => ({
      ...msg,
      id:  uuidv4() || "", // Chuyển ObjectId thành string
      reactions: [], // Mặc định rỗng
      image: [], // Mặc định rỗng
      delete: false, // Mặc định là chưa xóa
    }));

    return messages;
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return [];
  }
};


