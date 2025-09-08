import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Notification from "../models/NotificationsModel";
import { getNotificationMessageInterface } from "../types";

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
    })
      .limit(30)
      .select("_id message readed")
      .populate<{ message: getNotificationMessageInterface }>({
        path: "message",
        select: "createdAt type _id content classID uploadedBy",
        populate: {
          path: "uploadedBy",
          select: "username profilePicture",
        },
      })
      .lean();

    notification.sort((a, b) => {
      const dateA = new Date(a.message.createdAt).getTime();
      const dateB = new Date(b.message.createdAt).getTime();
      return dateB - dateA;
    });

    const filtered = notification.map((noti) => {
      const isReaded = noti.readed.some((id) => id.toString() === userID);
      return { ...noti, readed: isReaded };
    });

    res.status(200).json(filtered);
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
        "An unknow error occured in getNotications controller noticationsControllers.ts file : ",
        err,
      );
      res.status(500).json("Internal server error!");
      return;
    }
  }
};

export const markAllAsReaded = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized" });
    }

    await Notification.updateMany(
      {
        sendTo: { $in: userID },
      },
      { $pull: { sendTo: userID }, $push: { readed: userID } },
    );

    res.status(200).json({ message: "All notifications marked as readed." });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "An error occured in markAllAsReaded controller in notificationsControllers.ts file : ",
        err.message,
      );
      res.status(500).json("Internal server error!");
      return;
    } else {
      console.error(
        "An unknow error occured markAllAsReaded controller in noticationsControllers.ts file : ",
        err,
      );
      res.status(500).json("Internal server error!");
      return;
    }
  }
};
