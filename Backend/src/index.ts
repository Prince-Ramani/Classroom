import path from "path";

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import MongoConnect from "./MongoConnect";
import authRouter from "./Routes/authRoutes";
import classRouter from "./Routes/classesRoute";
import messageRouter from "./Routes/messagesRoute";
import commentRouter from "./Routes/commentsRoutes";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 8000;

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", authRouter);
app.use("/api/class", classRouter);
app.use("/api/message", messageRouter);
app.use("/api/comment", commentRouter);

app.get("*", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(404).json({ error: "No such api found!" });
});

app.listen(PORT, () => {
  MongoConnect();
  console.log("App listening on port ", PORT);
});
