import express from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  deleteComment,
  deleteReply,
  editComment,
  likeComment,
  replyComment,
  sendComment,
} from "../Controllers/commentControllers";

const router = express.Router();

router.post("/sendComment/:classID/:messageID", protectRoute, sendComment);
router.delete("/deleteComment/:commentID", protectRoute, deleteComment);
router.patch("/editComment/:classID/:commentID", protectRoute, editComment);
router.post("/likecomment/:classID/:commentID", protectRoute, likeComment);

router.post("/replycomment/:classID/:commentID", protectRoute, replyComment);
router.delete("/deleteReply/:commentID/:replyID", protectRoute, deleteReply);

export default router;
