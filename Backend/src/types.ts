import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: string; // or whatever type you expect for user
    }
  }
}

export interface createAccountInterface {
  username: string;
  email: string;
  password: string;
}
