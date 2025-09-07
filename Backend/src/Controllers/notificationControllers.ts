import { error } from "console";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Notification from "../models/NotificationsModel";

export const getNotifications = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized" });
    }

    const notification = await Notification.find({
      $or: [{ sendTo: { $in: userID } }, { readed: { $in: userID } }],
    });

    res.status(200).json({ ...notification });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "An error occured in getNotifications controller in notificationsControllers.ts file : ",
        err.message,
      );
      res.status(500).json("Internal server error!");
      return;
    } else {
      console.error(
        "An unknow error occured in noticationsControllers.ts file : ",
        err,
      );
      res.status(500).json("Internal server error!");
      return;
    }
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    const notificationID = req.params.notificationID;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized." });
    }

    if (!notificationID || !isValidObjectId(notificationID)) {
      res.status(400).json({
        error: "Notification id  required to delete notification.",
      });
    }

    const notification = await Notification.findByIdAndDelete(notificationID);

    res.status(200).json({ message: "Notification deleted." });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "An error occured in getNotifications controller in notificationsControllers.ts file : ",
        err.message,
      );
      res.status(500).json("Internal server error!");
      return;
    } else {
      console.error(
        "An unknow error occured in noticationsControllers.ts file : ",
        err,
      );
      res.status(500).json("Internal server error!");
      return;
    }
  }
};
