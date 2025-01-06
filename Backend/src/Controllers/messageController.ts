import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import Messages from "../models/MessagesModel";
import Classes from "../models/ClassModel";
import { error } from "console";

const FolderName = "GoogleClassroom";
const ImageFolder = FolderName + "/images";
const VideoFolder = FolderName + "/videos";
const DocsFolder = FolderName + "/docs";
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userID = req.user as string;
    const {
      content,
      classID,
    }: { content: string | undefined; classID: string | undefined } = req.body;
    let attachedImagesarr: string[] = [];
    let attachedVideoUrl: string | undefined;
    let attachedPdfsarr: string[] = [];

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "Content for message is required!" });
      return;
    }

    if (content.length < 3 || content.length > 200) {
      res.status(400).json({
        error: "Content should have charcter range betweeen 3 and 200!",
      });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id  required!" });
      return;
    }

    const classToSendMessage = await Classes.findById(classID);

    if (!classToSendMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToSendMessage.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "Only admins can send messages to class!" });
      return;
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const attachedImages = files?.["attachedImages"] as
      | Express.Multer.File[]
      | undefined;

    const attachedVideo = files?.["attachedVideo"] as
      | Express.Multer.File
      | undefined;

    const attachedPdfs = files?.["attachedPdfs"] as
      | Express.Multer.File[]
      | undefined;

    if (attachedImages && attachedImages.length > 0) {
      if (attachedImages.length > 4) {
        res
          .status(400)
          .json({ error: "Maximum 4 images can be uploaded at a time!" });
        return;
      }
      await Promise.all(
        attachedImages.map(async (img) => {
          try {
            const uploadResult = await cloudinary.uploader.upload(img.path, {
              resource_type: "image",
              folder: ImageFolder,
            });

            await unlink(img.path);

            attachedImagesarr.push(uploadResult.secure_url);
          } catch (err) {
            console.error(
              "Error uploading attachedImages in sendMessage : ",
              err
            );
            res.status(500).json("Internal sever error!");
            return;
          }
        })
      );
    }

    if (attachedImagesarr.length > 0) {
      const message = new Messages({
        content,
        attachedImages: attachedImagesarr,
        uploadedBy: userID,
        classID,
      });

      await message.save();
      res.status(200).json({ message: "Message sent!" });
      return;
    }

    if (attachedVideo) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          attachedVideo.path,
          {
            resource_type: "video",
            folder: VideoFolder,
          }
        );
        await unlink(attachedVideo.path);

        attachedVideoUrl = uploadResult.secure_url;
      } catch (err) {
        console.error("Error uploading attachedVideo in sendMessage : ", err);
        res.status(500).json("Internal sever error!");
        return;
      }
    }

    if (attachedVideoUrl) {
      const message = new Messages({
        content,
        attachedVideo: attachedVideoUrl,
        uploadedBy: userID,
        classID,
      });
      await message.save();

      res.status(200).json({ message: "Message sent!" });
      return;
    }

    if (attachedPdfs && attachedPdfs.length > 0) {
      if (attachedPdfs.length > 4) {
        res
          .status(400)
          .json({ error: "Maximum 4 documents can be uploaded at a time!" });
        return;
      }

      try {
        await Promise.all(
          attachedPdfs.map(async (pdf) => {
            const uploadResult = await cloudinary.uploader.upload(pdf.path, {
              resource_type: "raw",
              folder: DocsFolder,
            });
            await unlink(pdf.path);

            attachedPdfsarr.push(uploadResult.secure_url);
          })
        );
      } catch (err) {
        console.error("Error uploading attahcedPdfs in sendMessage : ", err);
        res.status(500).json("Internal sever error!");
        return;
      }
    }

    if (attachedPdfsarr.length > 0) {
      const message = new Messages({
        content,
        attachedPdfss: attachedPdfsarr,
        uploadedBy: userID,
        classID,
      });
      await message.save();

      res.status(200).json({ message: "Message sent!" });
      return;
    }

    const message = new Messages({
      content,
      uploadedBy: userID,
      classID,
    });
    await message.save();

    res.status(200).json({ message: "Message sent!" });
    return;
  } catch (err) {
    console.error("Error in sendMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
  }
};

export const editMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      classID,
      messageID,
      content,
    }: {
      classID: string | undefined;
      messageID: string | undefined;
      content: string | undefined;
    } = req.body;

    const userID = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    if (!messageID || messageID.trim() === "") {
      res.status(400).json({ error: "Message id required!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "class id required!" });
      return;
    }

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "Message content required!" });
      return;
    }

    const classOfMessage = await Classes.findById(classID).lean();

    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfMessage.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res.status(400).json({ error: "Only admin can edit class messages!" });
      return;
    }

    const message = await Messages.findOne({
      classID: classID,
      _id: messageID,
    });

    if (!message) {
      res.status(404).json({ error: "No such message found!" });
      return;
    }
    message.content = content;
    await message.save();

    res.json(200).json({ message: "Message edited successfully!" });
    return;
  } catch (err) {
    console.error("Error in editMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
  }
};

export const pinMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      classID,
      messageID,
    }: {
      classID: string | undefined;
      messageID: string | undefined;
    } = req.body;

    const userID = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    if (!messageID || messageID.trim() === "") {
      res.status(400).json({ error: "Message id required!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "class id required!" });
      return;
    }

    const classOfMessage = await Classes.findById(classID).lean();

    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfMessage.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res.status(400).json({ error: "Only admin can pin class messages!" });
      return;
    }

    const message = await Messages.findOne({
      _id: messageID,
      classID: classID,
    });

    if (!message) {
      res.status(404).json({ error: "No such message found!" });
      return;
    }

    if (message.isPinned) {
      message.isPinned = false;
    } else {
      message.isPinned = true;
    }

    await message.save();
    res.status(200).json({
      message: `Message ${
        message.isPinned ? "pinned" : "unpinned"
      } successfully!`,
    });
    return;
  } catch (err) {
    console.error("Error in  pinMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
    return;
  }
};

export const deleteMessaege = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      classID,
      messageID,
    }: {
      classID: string | undefined;
      messageID: string | undefined;
    } = req.body;

    const userID = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    if (!messageID || messageID.trim() === "") {
      res.status(400).json({ error: "Message id required!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "class id required!" });
      return;
    }

    const classOfMessage = await Classes.findById(classID).lean();

    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfMessage.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res.status(400).json({ error: "Only admin can delete class messages!" });
      return;
    }

    await Messages.findOneAndDelete({
      _id: messageID,
      classID: classID,
    });

    res.status(200).json({
      message: `Message deleted successfully!`,
    });
  } catch (err) {
    console.error("Error in  deleteMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
    return;
  }
};
