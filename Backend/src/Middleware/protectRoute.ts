import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../JWT";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await req.cookies["user"];

    if (!token) {
      return res.status(401).json("Unauthorized!");
    }

    const userID: string | null = verifyToken(token);

    if (!userID) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    req.user = userID;
    next();
  } catch (err) {
    console.log("Error in  protextRoute middleware : ", err);
    return res.status(500).json("Internal server error!");
  }
};
