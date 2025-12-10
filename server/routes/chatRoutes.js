import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  createChat,
  deleteChat,
  getChats,
  getChat,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/create", protect, createChat);
chatRouter.get("/get", protect, getChats);
chatRouter.get("/:id", protect, getChat);
chatRouter.post("/delete", protect, deleteChat);

export default chatRouter;
