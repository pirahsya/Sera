import express from "express";
import { paymentNotification } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/notification", paymentNotification);

export default paymentRouter;
