import { UserRole } from "@enum/userRolesEnum";
import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists!"],
      required: [true, "Email is required!"],
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      maxlength: [16, "Username cannot exceed 16 characters"],
    },
    fullname: {
      type: String,
      require: [false],
      maxlength: [30, "Full name cannot exceed 30 characters"],
    },
    birthdate: {
      type: String,
      require: [false],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    image: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    follower: {
      type: Number,
      required: false,
    },
    following: {
      type: Number,
      required: false,
    },
    blocked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    banned: {
      type: Boolean,
      default: false,
    },
    role: [
      {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;
