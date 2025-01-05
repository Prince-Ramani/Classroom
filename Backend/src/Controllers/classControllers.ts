import { Request, Response } from "express";
import User from "../models/UserModel";
import Classes from "../models/ClassModel";
import { createClassInterface } from "../types";
import { error } from "console";
import mongoose, { mongo } from "mongoose";

export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userID = req.user as string;
    const { name, description, teacherName }: createClassInterface = req.body;

    const user = await User.findOne({ _id: userID });

    if (!user) {
      res.status(404).json({ error: "No such user found!" });
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
      });

      await newClass.save();
      res.status(200).json({ message: "Class created successfully!" });
      return;
    }
    const newClass = new Classes({
      name,
      teacherName,
      admins: [req.user],
    });

    await newClass.save();
    res.status(200).json({ message: "Class created successfully!" });
  } catch (err) {
    console.error("Error in createClass controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classID: string | undefined = req.body;
    const userID = new mongoose.Types.ObjectId(req.user as string);

    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classToDelete = await Classes.findOne({ _id: classID }).lean();

    if (!classToDelete) {
      res.json(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToDelete.admins.includes(userID);

    if (!isAdmin) {
      res.status(403).json({ error: "Only admins can delete class!" });
      return;
    }
    await Classes.findOneAndDelete({ _id: classID });
    res.status(200).json({ message: "Class deleted successfully!" });
  } catch (err) {
    console.error("Error in deleteClass controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const editClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classID: string | undefined = req.body;
    const userID = new mongoose.Types.ObjectId(req.user as string);
    const { name, teacherName, description }: createClassInterface = req.body;
    if (!classID || classID.trim() === "") {
      res.status(400).json({ error: "Class id required!" });
      return;
    }

    const classToEdit = await Classes.findOne({ _id: classID });

    if (!classToEdit) {
      res.json(404).json({ error: "No such class found!" });
      return;
    }

    const isAdmin = classToEdit.admins.includes(userID);

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
