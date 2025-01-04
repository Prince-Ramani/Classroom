import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import { createAccountInterface } from "../types";
import User from "../models/UserModel";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createAccount: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password }: createAccountInterface = req.body;

    if (!username) {
      res.status(400).json({ error: "Username required!" });
      return;
    }
    if (username.length < 3) {
      res
        .status(400)
        .json({ error: "Username must have minimum 3 characters!" });
      return;
    }

    if (username.length > 12) {
      res
        .status(400)
        .json({ error: "Username must not exceed 12 characters!" });
      return;
    }

    const usernameAlreadyExists = await User.findOne({ username });

    if (usernameAlreadyExists) {
      res.status(409).json({ error: "Username already taken!" });
      return;
    }

    if (!email) {
      res.status(400).json({ error: "Email required!" });
      return;
    }

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      res.status(400).json({ error: "Invalid email format!" });
      return;
    }

    const emailTaken = await User.findOne({ email });

    if (emailTaken) {
      res
        .status(409)
        .json({ error: "Account with this email already exists!" });
      return;
    }

    if (!password || password.length < 6) {
      res
        .status(400)
        .json({ error: "Password length must be greater than 5!" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      profilePicture: process.env.defaultProfilePic || "",
    });

    await user.save();
    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.log("Error in creating account : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};
