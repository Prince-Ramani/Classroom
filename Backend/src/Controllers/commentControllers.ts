import { Request, Response } from "express";
import Classes from "../models/ClassModel";
import Messages from "../models/MessagesModel";
import { Comments } from "../models/commentModel";
import mongoose from "mongoose";

export const sendComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messageID: string | undefined = req.params.messageID;
    const classID: string | undefined = req.params.classID;

    const userID = req.user;
    const {
      commentContent,
    }: {
      commentContent: string | undefined;
    } = req.body;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    if (!messageID || messageID.trim() === "") {
      res.status(400).json({ error: "Message id required!" });
      return;
    }

    if (!commentContent || commentContent.trim() === "") {
      res.status(400).json({ error: "Comment content required!" });
      return;
    }

    if (commentContent.length > 100) {
      res
        .status(400)
        .json({ error: "Comment can't exceed 100 charachters required!" });
      return;
    }

    const classOfMessage = await Classes.findById(classID).lean();

    if (!classOfMessage) {
      res.status(404).json({ error: "No class found!" });
      return;
    }

    const isMember = classOfMessage.members.some(
      (mem) => mem.toString() === userID
    );

    const isAdmin = classOfMessage.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin && !isMember) {
      res.status(403).json({ error: "You are't memeber of class!" });
      return;
    }

    const messageToComment = await Messages.findById(messageID).lean();

    if (!messageToComment) {
      res.status(404).json({ error: "No such message found in class!" });
      return;
    }

    const newComment = new Comments({
      commentContent,
      commenter: userID,
      messageID,
      classID,
    });

    await newComment.save();
    res.status(201).json({ message: "Commented successfully!" });
  } catch (err) {
    console.error("Error in sendComment controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentID: string | undefined = req.params.commentID;
    const userID: string | undefined = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!commentID || commentID.trim() === "") {
      res.status(400).json({ error: "Comment id required!" });
      return;
    }

    const comment = await Comments.findById(commentID);

    if (!comment) {
      res.status(404).json({ error: "No such comment found!" });
      return;
    }

    const isCommenter = comment.commenter.toString() === userID;

    if (!isCommenter) {
      res.status(400).json({ error: "Only commenter can delete comment!" });
      return;
    }

    await Comments.findByIdAndDelete(comment._id);
    res.status(200).json({ message: "Comment delted successfully!" });
  } catch (err) {
    console.error("Error in deleteComment controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const editComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentID: string | undefined = req.params.commentID;
    const commentContent: string | undefined = req.body.commentContent;
    const userID: string | undefined = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!commentContent || commentContent.trim() === "") {
      res.status(400).json({ error: "Comment content required!" });
      return;
    }

    if (commentContent.length > 100) {
      res
        .status(400)
        .json({ error: "Comment can't exceed 100 charachters required!" });
      return;
    }

    if (!commentID || commentID.trim() === "") {
      res.status(400).json({ error: "Comment id required!" });
      return;
    }

    const comment = await Comments.findById(commentID);

    if (!comment) {
      res.status(404).json({ error: "No such comment found!" });
      return;
    }

    const isCommenter = comment.commenter.toString() === userID;

    if (!isCommenter) {
      res.status(400).json({ error: "Only commenter can edit comment!" });
      return;
    }

    await Comments.findByIdAndUpdate(comment._id, { commentContent });
    res.status(200).json({ message: "Comment edited successfully!" });
  } catch (err) {
    console.error("Error in editComment controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const likeComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentID: string | undefined = req.params.commentID;
    const classID: string | undefined = req.params.classID;
    const userID: string | undefined = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    if (!commentID || commentID.trim() === "") {
      res.status(400).json({ error: "Comment id required!" });
      return;
    }

    const classOfComment = await Classes.findById(classID).lean();

    if (!classOfComment) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfComment.admins.some(
      (admin) => admin.toString() === userID
    );

    const isMember = classOfComment.members.some(
      (member) => member.toString() === userID
    );

    if (!isAdmin && !isMember) {
      res
        .status(403)
        .json({ error: "Only members of class can like comments!" });
      return;
    }
    const comment = await Comments.findById(commentID);

    if (!comment) {
      res.status(404).json({ error: "No such comment found!" });
      return;
    }

    const isLiked = comment.likes.some((like) => like.toString() === userID);

    if (isLiked) {
      comment.likes = comment.likes.filter((c) => c.toString() !== userID);
    } else {
      comment.likes.push(new mongoose.Types.ObjectId(userID));
    }

    await comment.save();
    res.status(200).json({
      message: `Comment ${isLiked ? "unliked" : "liked"} successfully`,
    });
  } catch (err) {
    console.error("Error in likeComment controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const replyComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentID: string | undefined = req.params.commentID;
    const classID: string | undefined = req.params.classID;
    const userID: string | undefined = req.user;
    const {
      replyContent,
    }: {
      replyContent: string | undefined;
    } = req.body;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    if (!commentID || commentID.trim() === "") {
      res.status(400).json({ error: "Comment id required!" });
      return;
    }

    if (!replyContent || replyContent.trim() === "") {
      res.status(400).json({ error: "Reply content required!" });
      return;
    }

    if (replyContent.length > 100) {
      res.status(400).json({ error: "Reply cann't exceed 100 charachters!" });
      return;
    }

    const classOfComment = await Classes.findById(classID).lean();

    if (!classOfComment) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classOfComment.admins.some(
      (admin) => admin.toString() === userID
    );

    const isMember = classOfComment.members.some(
      (member) => member.toString() === userID
    );

    if (!isAdmin && !isMember) {
      res
        .status(403)
        .json({ error: "Only members of class can reply comments!" });
      return;
    }

    const comment = await Comments.findById(commentID);

    if (!comment) {
      res.status(404).json({ error: "No such comment found!" });
      return;
    }

    comment.replies.push({
      replierId: userID,
      replyContent: replyContent,
    });

    await comment.save();
    res.status(200).json({
      message: `Comment replied successfully`,
    });
  } catch (err) {
    console.error("Error in replyComment controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const deleteReply = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentID: string | undefined = req.params.commentID;
    const replyID: string | undefined = req.params.replyID;
    const userID: string | undefined = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized!" });
      return;
    }

    if (!replyID || replyID.trim() === "") {
      res.status(400).json({ error: "Reply id required!" });
      return;
    }

    if (!commentID || commentID.trim() === "") {
      res.status(400).json({ error: "Comment id required!" });
      return;
    }

    await Comments.findByIdAndUpdate(commentID, {
      $pull: { replies: { _id: replyID } },
    });

    res.status(200).json({
      message: `Reply deleted successfully`,
    });
  } catch (err) {
    console.error("Error in deleteReply controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};
