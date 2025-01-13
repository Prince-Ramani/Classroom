import express from "express";
import {
  createAccount,
  getMe,
  loginUser,
  logout,
  updateProfile,
} from "../Controllers/authControllers";
import { protectRoute } from "../Middleware/protectRoute";
import { upload } from "../Cloudinary/Cloudinary";

const router = express.Router();

router.post("/signup", createAccount);

router.post("/signin", loginUser);
router.post("/logout", protectRoute, logout);
router.patch(
  "/updateprofile",
  upload.single("profilePicture"),
  protectRoute,
  updateProfile
);
router.get("/getme", protectRoute, getMe);

export default router;
