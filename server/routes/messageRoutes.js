import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  messageController,
  streamMessageController,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", protect, messageController);
messageRouter.post("/stream", protect, streamMessageController);

export default messageRouter;
