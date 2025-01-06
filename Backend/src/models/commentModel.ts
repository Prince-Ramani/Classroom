import mongoose, { mongo } from "mongoose";

const commentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentContent: {
    type: String,
    required: true,
  },
  replies: [
    {
      replierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      replyContent: {
        type: String,
        required: true,
      },
      RepliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: [],
    },
  ],
  commentedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comments = mongoose.model("Comments", commentSchema);
