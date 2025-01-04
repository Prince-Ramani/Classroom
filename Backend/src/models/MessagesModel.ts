import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachedImage: {
      type: String,
      required: false,
    },
    attachedVideo: {
      type: String,
      required: false,
    },
    attachedPdf: {
      type: String,
      required: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    Comments: [
      {
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
      },
    ],
  },
  {
    timestamps: true,
  }
);
