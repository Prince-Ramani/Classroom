import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs";
import Messages from "../models/MessagesModel";
import Classes from "../models/ClassModel";
import Notification from "../models/NotificationsModel";

const FolderName = "GoogleClassroom";
const ImageFolder = FolderName + "/images";
const VideoFolder = FolderName + "/videos";
const DocsFolder = FolderName + "/docs";
export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user as string;
    const classID = req.params.classID;
    const {
      content,
      dueDate,
    }: {
      content: string | undefined;
      dueDate: string | undefined;
    } = req.body;

    let {
      type,
    }: {
      type: "Assignment" | "Normal" | "Classwork" | undefined;
    } = req.body;

    if (!type) {
      type = "Normal";
    }

    let attachedImagesarr: string[] = [];
    let attachedVideoUrl: string | undefined;
    let attachedPdfsarr: { link: string; fileName: string }[] = [];

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "Content for message is required!" });
      return;
    }

    if (content.length < 3 || content.length > 1200) {
      res.status(400).json({
        error: "Content should have character range betweeen 3 and 1200!",
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
      (admin) => admin.toString() === userID,
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

            unlink(`../uploads/${img.filename}`, (_) => {
              return;
            });

            attachedImagesarr.push(uploadResult.secure_url);
          } catch (err) {
            console.error(
              "Error uploading attachedImages in sendMessage : ",
              err,
            );
            res.status(500).json("Internal sever error!");
            return;
          }
        }),
      );
    } else if (attachedVideo) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          //@ts-ignore
          attachedVideo[0].path,
          {
            resource_type: "video",
            folder: VideoFolder,
          },
        );
        //@ts-ignore
        unlink(`../uploads/${attachedVideo[0].filename}`, (_) => {
          return;
        });

        attachedVideoUrl = uploadResult.secure_url;
      } catch (err) {
        console.error("Error uploading attachedVideo in sendMessage : ", err);
        res.status(500).json("Internal sever error!");
        return;
      }
    } else if (attachedPdfs && attachedPdfs.length > 0) {
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

            unlink(`../uploads/${pdf.filename}`, (_) => {
              return;
            });

            attachedPdfsarr.push({
              fileName: pdf.originalname,
              link: uploadResult.secure_url,
            });
          }),
        );
      } catch (err) {
        console.error("Error uploading attahcedPdfs in sendMessage : ", err);
        res.status(500).json("Internal sever error!");
        return;
      }
    }

    let message;

    if (attachedImagesarr.length > 0) {
      message = new Messages({
        content,
        attachedImages: attachedImagesarr,
        uploadedBy: userID,
        classID,
        type,
        dueDate: dueDate || "",
      });
    } else if (attachedVideoUrl) {
      message = new Messages({
        content,
        attachedVideo: attachedVideoUrl,
        uploadedBy: userID,
        classID,
        dueDate: dueDate || "",
        type,
      });
    } else if (attachedPdfsarr.length > 0) {
      message = new Messages({
        content,
        attachedPdfs: attachedPdfsarr,
        uploadedBy: userID,
        classID,
        dueDate: dueDate || "",
        type,
      });
    } else {
      message = new Messages({
        content,
        uploadedBy: userID,
        classID,
        type,
        dueDate: dueDate || "",
      });
    }
    await message.save();

    let sendTo = [...classToSendMessage.members, ...classToSendMessage.admins];

    const noti = new Notification({
      class: classToSendMessage._id,
      message: message._id,
      sendTo: sendTo,
    });
    await noti.save();

    res.status(200).json({ message: "Message sent!" });
    return;
  } catch (err) {
    console.error("Error in sendMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
  }
};

export const editMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      content,
    }: {
      content: string | undefined;
    } = req.body;

    const classID: string | undefined = req.params.classID;
    const messageID: string | undefined = req.params.messageID;

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
    if (content.length < 3 || content.length > 1200) {
      res.status(400).json({
        error: "Content should have character range betweeen 3 and 1200!",
      });
      return;
    }

    const classOfMessage = await Classes.findById(classID).lean();

    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfMessage.admins.some(
      (admin) => admin.toString() === userID,
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

    res.status(200).json({ message: "Message edited successfully!" });
  } catch (err) {
    console.error("Error in editMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
  }
};

export const pinMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;
    const messageID: string | undefined = req.params.messageID;

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
      (admin) => admin.toString() === userID,
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
  res: Response,
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;
    const messageID: string | undefined = req.params.messageID;

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
      (admin) => admin.toString() === userID,
    );

    if (!isAdmin) {
      res.status(400).json({ error: "Only admin can delete class messages!" });
      return;
    }

    const messageToDelete = await Messages.findOne({
      _id: messageID,
      classID: classID,
    });

    if (!messageToDelete) {
      res.status(404).json({ error: "No such message found!" });
      return;
    }

    if (messageToDelete.attachedImages.length > 0) {
      await Promise.all(
        messageToDelete.attachedImages.map(async (img) => {
          try {
            const imgPath = img.split("/").splice(-1)[0].split(".")[0];
            const imgID = `${ImageFolder}/${imgPath}`;
            await cloudinary.uploader.destroy(imgID, {
              resource_type: "image",
            });
            return;
          } catch (err) {
            console.error(
              "Error deleting attachedImages in deleteMesssage controller : ",
              err,
            );
            res.status(500).json("Internal sever error!");
            return;
          }
        }),
      );
    }

    if (messageToDelete.attachedVideo) {
      try {
        const vidPath = messageToDelete.attachedVideo
          .split("/")
          .splice(-1)[0]
          .split(".")[0];
        const videoID = `${VideoFolder}/${vidPath}`;
        await cloudinary.uploader.destroy(videoID, {
          resource_type: "video",
        });
        return;
      } catch (err) {
        console.error(
          "Error deleting attachedVideo in deleteMesssage controller : ",
          err,
        );
        res.status(500).json("Internal sever error!");
        return;
      }
    }

    if (messageToDelete.attachedPdfs.length > 0) {
      await Promise.all(
        messageToDelete.attachedPdfs.map(async (doc) => {
          try {
            const docPath = doc.link.split("/").splice(-1)[0].split(".")[0];
            const docID = `${ImageFolder}/${docPath}`;
            await cloudinary.uploader.destroy(docID, {
              resource_type: "raw",
            });
            return;
          } catch (err) {
            console.error(
              "Error deleting attachedDocs in deleteMesssage controller : ",
              err,
            );
            res.status(500).json("Internal sever error!");
            return;
          }
        }),
      );
    }

    await Messages.findOneAndDelete({ _id: messageID, classID: classID });
    await Notification.findOneAndDelete({ message: messageID });

    res.status(200).json({
      message: `Message deleted successfully!`,
    });
  } catch (err) {
    console.error("Error in  deleteMessage Controller : ", err);
    res.status(500).json("Internal sever error!");
    return;
  }
};
