import express from "express";
import {
  createAccount,
  getMe,
  loginUser,
  logout,
} from "../Controllers/authControllers";
import { protectRoute } from "../Middleware/protectRoute";

const router = express.Router();

router.post("/signup", createAccount);

router.post("/signin", loginUser);
router.post("/logout", protectRoute, logout);
router.get("/getme", protectRoute, getMe);

export default router;
