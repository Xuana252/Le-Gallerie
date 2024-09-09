import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    image: {
      type: String,
      required: [true, "image is required"],
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


const Post = models.Post||model('Post',PostSchema)
export default Post