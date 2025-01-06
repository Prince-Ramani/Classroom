import express from "express";
import {
  deleteMessaege,
  editMessage,
  pinMessage,
  sendMessage,
} from "../Controllers/messageController";
import { protectRoute } from "../Middleware/protectRoute";
import { upload } from "../Cloudinary/Cloudinary";

const router = express.Router();

router.post(
  "/sendmessage",
  protectRoute,
  upload.fields([
    { name: "attachedImages", maxCount: 4 },
    { name: "attachedVideo", maxCount: 1 },
    { name: "attachedPdfs", maxCount: 4 },
  ]),
  sendMessage
);
router.patch("/editmessage", protectRoute, editMessage);
router.patch("/pinmessage", protectRoute, pinMessage);
router.delete("/deletemessage", protectRoute, deleteMessaege);

export default router;
