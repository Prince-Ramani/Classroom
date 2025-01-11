import mongoose, { Document } from "mongoose";

interface uNumber extends Document {
  uniqueAddress: number;
  name: string;
  description?: string;
  teacherName: string;
  banner: string;
  admins: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[];
}

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uniqueAddress: {
      type: Number,
      unique: true,
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
        default: [],
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const generateRandom = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

classSchema.pre("save", async function (this: uNumber, next) {
  const doc = this;
  if (!doc.uniqueAddress) {
    let isUnique = false;
    let randomAddress: number;
    const maxAttempts = 100;
    let attempts = 0;

    while (!isUnique && attempts < maxAttempts) {
      randomAddress = generateRandom();
      const existingClass = await mongoose
        .model("Classes")
        .findOne({ uniqueAddress: randomAddress });

      if (!existingClass) {
        isUnique = true;
        doc.uniqueAddress = randomAddress;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(
        new Error("Failed to generate a unique address after several attempts")
      );
    }
  }

  next();
});
const Classes = mongoose.model<uNumber>("Classes", classSchema);

export default Classes;
