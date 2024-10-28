import { Request, Response } from "express";
// import ProductService from "../../services/products/ProductService";
import OrderService from "../services/orders/orderService";
import { orderDTO, orderInputDTO } from "../dto/orders/orderDTO";
// import limiter from "../emailConfig/emailLimiter";
// import sendEmail from "../utilities/sendMail";
import UserService from "../services/users/userService";
// import { generateOrderSummary } from "../utilities/smsMapper";
// import sendSms from "../utilities/sendSms";
// import sendMessage from "../utilities/sendMessage";
// import consumer from "../utilities/consumer";

class OrderController {
  private static instance: OrderController;
  private orderService: OrderService;
  private userService: UserService;

  private constructor() {
    this.orderService = new OrderService();
    this.userService = new UserService();
  }

  static getInstance(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }
  // CREATE a new order
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderInput: orderInputDTO = req.body;
      const createdOrder = await this.orderService.createOrder(orderInput);
      if (createdOrder) {
        // Sending order through sms and email , uncpmment when it will be used

        // const user = await this.userService.getById(createdOrder.userId);
        // const recipients = [user?.email];
        // const limitedSendEmail = limiter.wrap(sendEmail);
        // const emailPromises = recipients.map((recipient: string) => limitedSendEmail(createdOrder, recipient));
        // await Promise.all(emailPromises);
        // const userContact = {
        //   phone: '+917046048033' // User's phone number , for now it is static
        // };
        // const orderSummaryMessage = generateOrderSummary(createdOrder);
        // sendSms(userContact.phone,orderSummaryMessage)
        res.status(200).json(createdOrder);
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to create order", error: error.message });
    }
  }
  // GET ALL orders
  async getAllorders(req: Request, res: Response): Promise<void> {
    try {
      const orders: orderDTO[] = await this.orderService.getAllOrders();
      // sendMessage("order-topic", JSON.stringify(orders))
      res.status(200).json(orders);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get orders", error: error.message });
    }
  }
  async getOrderByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req?.query?.userId as string | undefined;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const product: orderDTO[] | null =
        await this.orderService.getOrderByUserId(userId);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get order", error: error.message });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }
      const order: orderDTO | null =
        await this.orderService.getOrderById(orderId);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get order by ID", error: error.message });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId: string = req.params.id;
      const orderInput: orderInputDTO = req.body;
      const updatedOrder: orderDTO[] | null =
        await this.orderService.updateOrder(orderId, orderInput);
      if (updatedOrder) {
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to update order", error: error.message });
    }
  }
  async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderId: string = req.params.id;
      await this.orderService.deleteOrder(orderId);
      res.status(200).json({ message: "Order has been deleted" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to delete order", error: error.message });
    }
  }
}

export default OrderController;
