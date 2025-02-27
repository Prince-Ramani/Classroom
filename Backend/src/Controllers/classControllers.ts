import { Request, Response } from "express";
import User from "../models/UserModel";
import Classes from "../models/ClassModel";
import { createClassInterface } from "../types";
import mongoose, { mongo } from "mongoose";
import Messages from "../models/MessagesModel";
import { Comments } from "../models/commentModel";

export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userID = req.user as string;
    const { name, description, teacherName }: createClassInterface = req.body;

    const user = await User.findOne({ _id: userID });

    if (!user) {
      res.status(404).json({ error: "Unauthorized!" });
      return;
    }

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Class name required!" });
      return;
    }

    if (name.length > 30 || name.length < 3) {
      res.status(400).json({
        error: "Class name must be of minimum 3 and maximum 30 characters!",
      });
      return;
    }
    if (!teacherName || teacherName.trim() === "") {
      res.status(400).json({ error: "Teacher name required!" });
    }

    if (teacherName.length > 30 || teacherName.length < 3) {
      res.status(400).json({
        error: "Teacher name must be of minimum 3 and maximum 30 characters!",
      });
      return;
    }

    if (description && description.length > 100) {
      res
        .status(400)
        .json({ error: "Description must not exceed 100 charaters" });
      return;
    }

    if (description) {
      const newClass = new Classes({
        name,
        description,
        teacherName,
        admins: [req.user],
        banner: process.env.defaultClassBanner || "",
      });

      await newClass.save();
      user.classesJoined.push(newClass._id as mongoose.Types.ObjectId);
      await user.save();
      res.status(200).json({ message: "Class created successfully!" });
      return;
    }
    const newClass = new Classes({
      name,
      teacherName,
      admins: [req.user],
      banner: process.env.defaultClassBanner || "",
    });

    await newClass.save();
    res.status(200).json({ message: "Class created successfully!" });
  } catch (err) {
    console.error("Error in createClass controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const joinClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      classID,
    }: {
      classID: string | undefined;
    } = req.body;

    const userID = req.user as string;

    if (!classID || typeof classID !== "string" || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const address = parseInt(classID);

    const classToJoin = await Classes.findOne({ uniqueAddress: address });

    if (!classToJoin) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAlreadyMember = classToJoin.members.some(
      (member) => member.toString() === userID
    );

    const isAdmin = classToJoin.admins.some(
      (admin) => admin.toString() === userID
    );

    if (isAlreadyMember || isAdmin) {
      res.status(404).json({ error: "You are alredy a member of class!" });
      return;
    }

    const me = await User.findById(userID);

    if (!me) return;

    classToJoin.members.push(new mongoose.Types.ObjectId(userID));
    me.classesJoined.push(classToJoin._id as mongoose.Types.ObjectId);
    await classToJoin.save();
    await me.save();

    res.status(200).json({ message: "Joined class successfully!" });
  } catch (err) {
    console.error("Error in newAdmin controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const leaveClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    const userID = req.user as string;

    if (!classID || typeof classID !== "string" || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classToLeave = await Classes.findById(classID);

    if (!classToLeave) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isJoined = classToLeave.members.some(
      (member) => member.toString() === userID
    );

    const isAdmin = classToLeave.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isJoined && !isAdmin) {
      res.status(404).json({ error: "You aren't in class!" });
      return;
    }

    const me = await User.findById(userID);

    if (!me) return;

    if (isJoined) {
      classToLeave.members = classToLeave.members.filter((member) => {
        return member.toString() !== userID;
      });
    }

    if (isAdmin) {
      classToLeave.admins = classToLeave.admins.filter((admin) => {
        return admin.toString() !== userID;
      });
    }

    if (classToLeave.admins.length === 0) {
      await Classes.findByIdAndDelete(classToLeave._id);
      res
        .status(200)
        .json({ message: "Leaved and deleted class successfully!" });
      return;
    }

    me.classesJoined = me.classesJoined.filter(
      (join) =>
        join.toString() !==
        (classToLeave._id as mongoose.Types.ObjectId).toString()
    );

    await classToLeave.save();
    await me.save();

    res.status(200).json({ message: "Leaved class successfully!" });
  } catch (err) {
    console.error("Error in newAdmin controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { classID }: { classID: string | undefined } = req.body;
    const userID = req.user as string;

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classToDelete = await Classes.findOne({ _id: classID }).lean();

    if (!classToDelete) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToDelete.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res.status(403).json({ error: "Only admins can delete class!" });
      return;
    }

    await Promise.all(
      classToDelete.members.map((member) => {
        return User.findByIdAndUpdate(member, {
          $pull: { classesJoined: classToDelete._id },
        });
      })
    );

    await Classes.findOneAndDelete({ _id: classID });

    res.status(200).json({ message: "Class deleted successfully!" });
  } catch (err) {
    console.error("Error in deleteClass controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const editClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classID }: { classID: string | undefined } = req.body;
    const userID = req.user as string;

    const { name, teacherName, description }: createClassInterface = req.body;
    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classToEdit = await Classes.findOne({ _id: classID });

    if (!classToEdit) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToEdit.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res.status(403).json({ error: "Only admins can delete class!" });
      return;
    }
    if ((name && name.length > 30) || name.length < 3) {
      res.status(400).json({
        error: "Class name must be of minimum 3 and maximum 30 characters!",
      });
      return;
    }

    if (description && description.length > 100) {
      res
        .status(400)
        .json({ error: "Description  must not exceed 100 characters!" });
      return;
    }

    if (teacherName && teacherName.length > 30) {
      res.status(400).json({
        error: "Teacher name must be of minimum 3 and maximum 30 characters!",
      });
      return;
    }

    if (description) classToEdit.description = description;
    classToEdit.name = name || classToEdit.name;
    classToEdit.teacherName = teacherName || classToEdit.teacherName;

    await classToEdit.save();
    res.status(200).json({ message: "Class updated succesfully!" });
    return;
  } catch (err) {
    console.error("Error in editClass controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userID = req.user;

    if (!userID) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findOne({ _id: userID });

    if (!user) {
      res.status(404).json({ error: "No such user found!" });
      return;
    }

    const TotalClasses = await Classes.find({
      _id: { $in: user.classesJoined },
    })
      .select("_id name teacherName description banner members admins")
      .lean();

    const filteredClasses = TotalClasses.map((cl) => ({
      ...cl,
      members: cl.members.length,
      admins: cl.admins.length,
    }));

    res.status(200).json(filteredClasses);
  } catch (err) {
    console.error("Error in getClass controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const askedClass = await Classes.findOne({ _id: classID })
      .select("banner _id createdAt description name teacherName admins")
      .lean();
    if (!askedClass) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    res.status(200).json(askedClass);
  } catch (err) {
    console.error("Error in getClass controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const getClassSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;
    const me = req.user;

    if (!me) {
      res.status(400).json({ error: "Unauthrized!" });
      return;
    }
    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const askedClass = await Classes.findOne({ _id: classID })
      .select(
        "banner _id createdAt description name teacherName admins uniqueAddress "
      )
      .lean();

    if (!askedClass) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = askedClass.admins.some((i) => i.toString() === me);

    if (!isAdmin) {
      res.status(400).json({ error: "Only admins can access class settings!" });
      return;
    }

    res.status(200).json(askedClass);
  } catch (err) {
    console.error("Error in getClassSettings controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classMessages = await Messages.find({ classID: classID })
      .sort({ isPinned: -1, createdAt: -1 })
      .populate({
        path: "uploadedBy",
        select: "_id profilePicture username",
      })
      .lean();

    const classM = await Promise.all(
      classMessages.map(async (ms) => {
        const commentLength = await Comments.countDocuments({
          messageID: ms._id,
          classID: ms.classID,
        });

        return { ...ms, commentLength };
      })
    );

    res.status(200).json(classM);
  } catch (err) {
    res.status(500).json({ error: "Internal sever error!" });
    console.log("Error in getMessages controller : ", err);
  }
};

export const getClasswork = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classMessages = await Messages.find({
      $and: [{ classID: classID }, { type: { $ne: "Normal" } }],
    })
      .sort({ isPinned: -1, createdAt: -1 })
      .populate({
        path: "uploadedBy",
        select: "_id profilePicture username",
      })
      .lean();

    const classM = await Promise.all(
      classMessages.map(async (ms) => {
        const commentLength = await Comments.countDocuments({
          messageID: ms._id,
          classID: ms.classID,
        });

        return { ...ms, commentLength };
      })
    );

    res.status(200).json(classM);
  } catch (err) {
    res.status(500).json({ error: "Internal sever error!" });
    console.log("Error in getMessages controller : ", err);
  }
};

export const getMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classDetails = await Classes.findOne({ _id: classID })
      .select("members admins")
      .populate({
        path: "members",
        select: "_id profilePicture username",
      })
      .populate({
        path: "admins",
        select: "_id profilePicture username",
      });

    res.status(200).json(classDetails);
  } catch (err) {
    res.status(500).json({ error: "Internal sever error!" });
    console.log("Error in getMessages controller : ", err);
  }
};

export const getFullMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;
    const messageID: string | undefined = req.params.messageID;
    const userID: string | undefined = req.user;

    if (!userID || userID.trim() === "") {
      res.status(400).json({ error: "Unauthorized!" });
      return;
    }

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Classid required!" });
      return;
    }

    const classOfMessage = await Classes.findOne({ _id: classID }).lean();
    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const classMessage = await Messages.findOne({ _id: messageID })
      .populate({ path: "classID", select: "_id name admins" })
      .populate({ path: "uploadedBy", select: "profilePicture _id username" })
      .lean();

    if (!classMessage) {
      res.status(404).json({ error: "No such message found!" });
      return;
    }
    //@ts-ignore
    const isAdmin = classMessage.classID.admins.some(
      (p: mongoose.Types.ObjectId) => p.toString() === userID
    );
    //@ts-ignore
    const classname = classMessage.classID.name || "";

    res.status(200).json({
      ...classMessage,
      classID: classMessage.classID._id,
      isAdmin,
      classname,
    });
  } catch (err) {
    console.error("Error in getFullMessage controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const classID: string | undefined = req.params.classID;
    const messageID: string | undefined = req.params.messageID;

    if (!classID || classID.trim() === "" || typeof classID !== "string") {
      res.status(400).json({ error: "Classid required!" });
      return;
    }

    const classOfMessage = await Classes.findOne({ _id: classID }).lean();
    if (!classOfMessage) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const comments = await Comments.find({ classID, messageID })
      .populate({ path: "commenter", select: "_id username profilePicture" })
      .populate({
        path: "replies.replierId",
        select: "_id username profilePicture",
      })
      .sort({ commentedAt: -1 })
      .lean();

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error in getComments controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const newAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      classID,
      personID,
    }: {
      classID: string | undefined;
      personID: string | undefined;
    } = req.body;

    const userID = req.user as string;

    if (!classID || typeof classID !== "string" || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    if (!personID || typeof personID !== "string" || personID.trim() === "") {
      res.status(400).json({ error: "Admin id required!" });
      return;
    }

    if (personID === userID) {
      res
        .status(400)
        .json({ error: "You cannot remove yourself from being admin!" });
      return;
    }

    const classToUpdate = await Classes.findOne({ _id: classID });

    if (!classToUpdate) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToUpdate.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "Only admins can remove someone from admin!" });
      return;
    }

    const personIsAdmin = classToUpdate.admins.some(
      (admin) => admin.toString() === personID
    );

    if (personIsAdmin) {
      classToUpdate.admins = classToUpdate.admins.filter(
        (admin) => admin.toString() !== personID.toString()
      );
    } else {
      classToUpdate.admins.push(new mongoose.Types.ObjectId(personID));
    }

    await classToUpdate.save();
    res.status(200).json({
      message: `${!isAdmin ? "New admin created" : "Removed from admin!"}`,
    });
  } catch (err) {
    console.error("Error in newAdmin controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const removeMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.params.classID;

    const personID: string | undefined = req.params.personID;

    const userID = req.user as string;

    if (!classID || typeof classID !== "string" || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    if (!personID || typeof personID !== "string" || personID.trim() === "") {
      res.status(400).json({ error: "Admin id required!" });
      return;
    }

    if (personID === userID) {
      res.status(400).json({ error: "You cann't remove youself from class!" });
      return;
    }

    const classToUpdate = await Classes.findById(classID);

    if (!classToUpdate) {
      res.status(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToUpdate.admins.some(
      (admin) => admin.toString() === userID
    );

    if (!isAdmin) {
      res
        .status(403)
        .json({ error: "Only admins can remove someone from class!" });
      return;
    }

    const isMember = classToUpdate.members.some(
      (member) => member.toString() === userID
    );

    if (!isMember) {
      res.status(400).json({ error: "You aren't in class!" });
      return;
    }

    const personToBeRemoved = await User.findById(personID);

    if (!personToBeRemoved) {
      res.status(404).json({ error: "No such user found!" });
      return;
    }

    classToUpdate.members = classToUpdate.members.filter(
      (member) => member.toString() !== userID
    );
    personToBeRemoved.classesJoined = personToBeRemoved.classesJoined.filter(
      (c) =>
        c.toString() !==
        (classToUpdate._id as mongoose.Types.ObjectId).toString()
    );

    await classToUpdate.save();
    await personToBeRemoved.save();

    res.status(200).json({ message: "Removed from class!" });
  } catch (err) {
    console.error("Error in newAdmin controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};
