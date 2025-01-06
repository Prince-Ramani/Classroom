import path from "path";

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import MongoConnect from "./MongoConnect";
import authRouter from "./Routes/authRoutes";
import classRouter from "./Routes/classesRoute";
import messageRouter from "./Routes/messagesRoute";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/", authRouter);
app.use("/class", classRouter);
app.use("/message", messageRouter);

app.listen(PORT, () => {
  MongoConnect();
  console.log("App listening on port ", PORT);
});
