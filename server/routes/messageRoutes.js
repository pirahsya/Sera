import express from "express";
import { protect } from "../middlewares/auth.js";
import { messageController } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", protect, messageController);

export default messageRouter;
