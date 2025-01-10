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
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      res: "Classes",
      required: true,
    },

    attachedImages: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
    attachedVideo: {
      type: String,
      required: false,
    },
    attachedPdfs: [
      {
        link: { type: String, required: true },
        fileName: { type: String, required: true },
        default: [],
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Messages = mongoose.model("Messages", messagesSchema);

export default Messages;
