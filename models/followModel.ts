import mongoose, { Schema, model, models } from "mongoose";

const FollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow ;
