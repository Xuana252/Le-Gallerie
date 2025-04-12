import AiChatBox, { AiChatBoxType } from "@models/aiChatBoxModel";
import { NextRequest, NextResponse } from "@node_modules/next/server";
import { connectToDB } from "@utils/database";
import { v4 as uuidv4 } from "uuid";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDB();
    const chatBox = await AiChatBox.findOne({ chatId: params.id })
      .select("messages.text messages.senderId messages.createdAt")
      .lean<AiChatBoxType>();

    if (!chatBox || !chatBox.messages) {
      return [];
    }
    const messages = chatBox.messages.reverse().map((msg: any) => ({
      ...msg,
      reactions: [], 
      image: [], 
      delete: false, 
    }));

    return NextResponse.json({ messages: messages }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch ai chat log" },
      { status: 500 }
    );
  }
};
