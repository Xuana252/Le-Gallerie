import mongoose, { Schema, model, models } from "mongoose";

const LikeSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Like = models.Like || model("Like", LikeSchema);

export default Like ;
