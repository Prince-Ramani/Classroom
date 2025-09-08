import { Router } from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  getNotifications,
  markAllAsReaded,
} from "../Controllers/notificationControllers";
const router = Router();

router.get("/getNotifications", protectRoute, getNotifications);
router.put("/markAllAsReaded", protectRoute, markAllAsReaded);

export default router;
