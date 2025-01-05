import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../JWT";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = await req.cookies["user"];

    if (!token) {
      res.status(401).json("Unauthorized!");
      return;
    }

    const userID: string | null = verifyToken(token);

    if (!userID) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }

    req.user = userID;

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized!" });
    }

    next();
  } catch (err) {
    console.log("Error in  protectRoute middleware : ", err);
    res.status(500).json("Internal server error!");
  }
};
