import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: process.env.defaultProfilePic,
    },
    pinnedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
        default: [],
        required: false,
      },
    ],
    classesJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
        default: [],
        required: false,
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
