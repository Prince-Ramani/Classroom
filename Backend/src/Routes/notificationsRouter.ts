import { Router } from "express";
import { protectRoute } from "../Middleware/protectRoute";
import {
  deleteNotification,
  getNotifications,
} from "../Controllers/notificationControllers";
const router = Router();

router.get("/getNotifications", protectRoute, getNotifications);

router.delete(
  "/delete/notification/:notificationID",
  protectRoute,
  deleteNotification,
);
