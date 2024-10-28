import { Request, Response } from "express";
import OrderService from "../services/orders/orderService";
import PyamentService from "../services/paymentService";
import limiter from "../emailConfig/emailLimiter";
import sendEmail from "../utilities/sendMail";
import { generateOrderSummary } from "../utilities/smsMapper";
import sendSms from "../utilities/sendSms";
// import consumer from "../utilities/consumer";

class PaymentController {
  private static instance: PaymentController;
  private orderService: OrderService;
  private paymentService: PyamentService;

  private constructor() {
    this.orderService = new OrderService();
    this.paymentService = new PyamentService();
  }

  static getInstance(): PaymentController {
    if (!PaymentController.instance) {
      PaymentController.instance = new PaymentController();
    }
    return PaymentController.instance;
  }
  // CREATE a new order
  async createPyament(req: Request, res: Response): Promise<void> {
    try {
      const {
        amount,
        userId,
        email,
        phoneNumber,
        products,
        pointsUsed,
        addresId,
      } = req.body;

      if (!amount || !userId || !(email || phoneNumber)) {
        res.status(400).json({ message: "All fields are required." });
        return;
      }

      const createdPayment = await this.paymentService.createPayment(
        amount,
        userId,
        email,
        phoneNumber,
      );
      console.log("createdPayment", createdPayment);
      if (createdPayment) {
        const createdOrder = await this.orderService.createOrder({
          userId,
          deliveryAddressId: addresId,
          paymentId: null,
          status: "pending",
          Products: products,
          orderDate: new Date(),
          totalAmount: amount,
          pointsUsed,
        });
        console.log("createdOrder", createdOrder);
        // Sending order through sms and email , uncpmment when it will be used
        if (createdOrder && createdOrder[0]) {
          const limitedSendEmail = limiter.wrap(sendEmail);
          const recipients = [email, "saluja.pawan6@gmail.com"];
          const emailPromises = recipients.map((recipient: string) =>
            limitedSendEmail(createdOrder[0], recipient),
          );
          await Promise.all(emailPromises);

          if (phoneNumber) {
            const userContact = {
              phone: phoneNumber,
            };
            const orderSummaryMessage = generateOrderSummary(createdOrder[0]);
            await sendSms(userContact.phone, orderSummaryMessage);
          }
        }
        res
          .status(200)
          .json({ message: "sucesss", data: { createdPayment, createdOrder } });
      }
    } catch (error: any) {
      console.log("error", error);
      res
        .status(500)
        .json({ message: "Failed to create payemnt", error: error.message });
    }
  }
}

export default PaymentController;
