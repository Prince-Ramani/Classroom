import path from "path";

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import MongoConnect from "./MongoConnect";
import authRouter from "./Routes/authRoutes";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);

app.listen(PORT, () => {
  MongoConnect();
  console.log("App listening on port ", PORT);
});
