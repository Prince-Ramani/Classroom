import express from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  createClass,
  deleteClass,
  editClass,
  getClass,
  getFullMessage,
  joinClass,
  leaveClass,
  newAdmin,
  removeAdmin,
  removeMember,
} from "../Controllers/classControllers";

const router = express.Router();

router.post("/createclass", protectRoute, createClass);
router.post("/joinclass", protectRoute, joinClass);
router.post("/leaveclass", protectRoute, leaveClass);
router.delete("/deleteclass", protectRoute, deleteClass);
router.patch("/editclass", protectRoute, editClass);
router.get("/getclass/:classID", protectRoute, getClass);
router.get("/getMessage/:classID/:messageID", protectRoute, getFullMessage);
router.patch("/makeadmin", protectRoute, newAdmin);
router.patch("/removeadmin", protectRoute, removeAdmin);
router.patch("/removemember", protectRoute, removeMember);

export default router;
