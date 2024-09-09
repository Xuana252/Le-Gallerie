import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
      require: true,
    },
    likes: {
      type: Number,
      required: false,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);


const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
