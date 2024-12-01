import express, { Request, Response } from "express";
import TransactionController from "../controllers/transaction.controller";

const router = express.Router();
const controller = TransactionController.getControllerInstance();

router.get("/get/:uid", (req: Request, res: Response) => {
  controller.get(req, res);
});

router.post("/log", async (req: Request, res: Response) => {
  controller.log(req, res);
});

export default router;
