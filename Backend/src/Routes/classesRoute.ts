import express from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  createClass,
  deleteClass,
  editClass,
  getClass,
  getClasses,
  getComments,
  getFullMessage,
  getMembers,
  getMessages,
  joinClass,
  leaveClass,
  newAdmin,
  removeAdmin,
  removeMember,
} from "../Controllers/classControllers";

const router = express.Router();

router.post("/createclass", protectRoute, createClass);
router.post("/joinclass", protectRoute, joinClass);
router.post("/leaveclass/:classID", protectRoute, leaveClass);
router.delete("/deleteclass", protectRoute, deleteClass);
router.patch("/editclass", protectRoute, editClass);
router.get("/getclasses", protectRoute, getClasses);

router.get("/getclass/:classID", protectRoute, getClass);
router.get("/getmessages/:classID", protectRoute, getMessages);
router.get("/getMessage/:classID/:messageID", protectRoute, getFullMessage);
router.patch("/makeadmin", protectRoute, newAdmin);
router.patch("/removeadmin", protectRoute, removeAdmin);
router.patch("/removemember", protectRoute, removeMember);
router.get("/getmembers/:classID", protectRoute, getMembers);
router.get("/getComments/:classID/:messageID", protectRoute, getComments);

export default router;
