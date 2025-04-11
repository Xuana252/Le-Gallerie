import mongoose, { model, models, Schema } from "mongoose";

interface Message {
    _id?: string;
    senderId: string;
    text: string;
    createdAt: Date;
  }

export interface AiChatBoxType {
    chatId: string;
    messages: Message[];
  }

const MessageSchema = new Schema({
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now } 
});

const AiChatBoxSchema = new Schema({
    chatId: { type: String, required: true },
    messages: [MessageSchema] 
});

const AiChatBox = models.AiChatBox || model('AiChatBox', AiChatBoxSchema)

export default AiChatBox;
