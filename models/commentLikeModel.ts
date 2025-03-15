import mongoose, { Schema, model, models } from "mongoose";
import User from "./userModel";
import Comment from "./commentModel";
import { Reaction } from "@app/enum/reactionEnum";

const CommentLikeSchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: Comment,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    reaction: {
      type: String,
      enum: Object.values(Reaction),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



const CommentLike =
  models.CommentLike || model("CommentLike", CommentLikeSchema);

export default CommentLike;
