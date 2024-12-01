import express, { Request, Response } from "express";
import PaymentController from "../controllers/payment.controller";
// import { verifyFirebaseToken } from "../middlewares/auth/firebaseJWT";

const router = express.Router();
const paymentController = PaymentController.getInstance();

router.post("/createPayment", async (req: Request, res: Response) => {
  try {
    await paymentController.createPyament(req, res);
  } catch (error) {
    console.error("Error in /createPayment route:", error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
