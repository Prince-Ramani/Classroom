import bcrypt from "bcryptjs";
import { Request, RequestHandler, Response } from "express";
import { createAccountInterface } from "../types";
import User from "../models/UserModel";
import { createToken } from "../JWT";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const verification = await bcrypt.compare(password, hashedPassword);

  return verification;
};

export const createAccount: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { username, email, password }: createAccountInterface = req.body;

    if (!username || username.trim() === "") {
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

    const usernameAlreadyExists = await User.exists({ username });

    if (usernameAlreadyExists) {
      res.status(409).json({ error: "Username already taken!" });
      return;
    }

    if (!email || email.trim() === "") {
      res.status(400).json({ error: "Email required!" });
      return;
    }

    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      res.status(400).json({ error: "Invalid email format!" });
      return;
    }

    const emailTaken = await User.exists({ email });

    if (emailTaken) {
      res
        .status(409)
        .json({ error: "Account with this email already exists!" });
      return;
    }

    if (!password || password.length < 6 || password.trim() === "") {
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

    const token = createToken(user._id.toString());

    res.cookie("user", token, {
      maxAge: 1000 * 60 * 60,
    });

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Error in creating account : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      res.status(400).json({ error: "Email required!" });
      return;
    }

    if (!password || password.trim() === "") {
      res.status(400).json({ error: "Password required!" });
      return;
    }

    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      res.status(400).json({ error: "Invalid email format!" });
      return;
    }

    const user = await User.findOne({ email }).lean();

    if (!user) {
      res
        .status(404)
        .json({ error: "Account with this email doesn't exists!" });
      return;
    }

    const passwordCorrect = await verifyPassword(password, user.password);

    if (!passwordCorrect) {
      res.status(401).json({ error: "Incorrect password!" });
      return;
    }

    const token = createToken(user._id.toString());

    res.cookie("user", token, {
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (err) {
    console.error("Error in login controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.clearCookie("user");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error in logout controller : ", err);
    res.status(500).json({ error: "Internal sever error!" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userID = req.user as string;

    const user = await User.findOne({ _id: userID }).lean();

    if (!user) {
      res.status(401).json({ error: "Unauthorized!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getMe controller : ", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};
