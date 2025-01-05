import express from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  createClass,
  deleteClass,
  editClass,
} from "../Controllers/classControllers";

const router = express.Router();

router.post("/createclass", protectRoute, createClass);
router.delete("/deleteclass", protectRoute, deleteClass);
router.patch("/editclass", protectRoute, editClass);

export default router;
