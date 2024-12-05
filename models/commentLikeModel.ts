import mongoose, { Schema, model, models } from "mongoose";
import User from "./userModel";
import Comment from "./commentModel";

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
  },
  {
    timestamps: true,
  }
);

const CommentLike = models.CommentLike || model("CommentLike", CommentLikeSchema);

export default CommentLike ;
