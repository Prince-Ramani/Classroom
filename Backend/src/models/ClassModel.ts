import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    teacherName: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      default: process.env.defaultClassBanner || "",
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Classes = mongoose.model("Classes", classSchema);

export default Classes;
