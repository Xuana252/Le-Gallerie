import mongoose, { Schema, model, models } from "mongoose";
import Post from "./postModel";
import User from "./userModel";
import { Reaction } from "@enum/reactionEnum";
import Comment from "./commentModel";

const ReportSchema = new Schema(
  {
    reportId: {
      type: Schema.Types.ObjectId,
      refPath: "type",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    type: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Report = models.Report || model("Report", ReportSchema);

export default Report;
