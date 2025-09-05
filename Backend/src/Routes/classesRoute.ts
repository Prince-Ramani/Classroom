import express from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  createClass,
  deleteClass,
  editClass,
  getClass,
  getClasses,
  getClassSettings,
  getClasswork,
  getComments,
  getFullMessage,
  getMembers,
  getMessages,
  joinClass,
  leaveClass,
  newAdmin,
  pinAClass,
  removeMember,
} from "../Controllers/classControllers";

const router = express.Router();

router.post("/createclass", protectRoute, createClass);
router.post("/joinclass", protectRoute, joinClass);
router.post("/leaveclass/:classID", protectRoute, leaveClass);
router.delete("/deleteclass", protectRoute, deleteClass);
router.patch("/editclass", protectRoute, editClass);
router.get("/getclasses", protectRoute, getClasses);
router.get("/getclass/settings/:classID", protectRoute, getClassSettings);

router.get("/getclass/:classID", protectRoute, getClass);
router.get("/getmessages/:classID", protectRoute, getMessages);
router.get("/getclasswork/:classID", protectRoute, getClasswork);
router.get("/getMessage/:classID/:messageID", protectRoute, getFullMessage);
router.patch("/makeadmin", protectRoute, newAdmin);
router.patch("/removemember/:classID/:personID", protectRoute, removeMember);
router.get("/getmembers/:classID", protectRoute, getMembers);
router.get("/getComments/:classID/:messageID", protectRoute, getComments);
router.patch("/pinAClass/:classID", protectRoute, pinAClass);

export default router;
