import express from "express";
import { createAccount } from "../Controllers/authControllers";

const router = express.Router();

router.post("/signup", createAccount);

export default router;
