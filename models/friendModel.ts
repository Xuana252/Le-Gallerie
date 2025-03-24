import mongoose, { Schema, model, models } from "mongoose";
import User from "./userModel";

const FriendSchema = new Schema(
  {
    user1: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    state : {
        type:String,
        enum: ["friend","pending"],
        required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Friend = models.Friend||model('Friend',FriendSchema)

export default Friend