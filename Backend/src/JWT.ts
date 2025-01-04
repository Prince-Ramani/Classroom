import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (userID: string): string => {
  if (!process.env.JWT_SECRET_KEY) {
    console.log("JWT key not found!");
    process.exit(1);
  }

  let token = jwt.sign({ userID }, process.env.JWT_SECRET_KEY);
  return token;
};

export const verifyToken = (token: string): string | null => {
  if (!process.env.JWT_SECRET_KEY) {
    console.log("JWT key not found!");
    process.exit(1);
  }

  try {
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }

  let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

  return decoded.userID;
};
