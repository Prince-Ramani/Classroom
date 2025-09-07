import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classes",
    required: true,
  },
  sendTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  readed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
    required: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
