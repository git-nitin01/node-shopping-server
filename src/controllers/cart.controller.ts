/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
// import ProductService from "../../services/products/ProductService";
// import OrderService from "../services/orders/orderService";
// import { orderDTO, orderInputDTO } from "../dto/orders/orderDTO";
// import limiter from "../emailConfig/emailLimiter";
// import sendEmail from "../utilities/sendMail";
// import UserService from "../services/users/userService";
// import { generateOrderSummary } from "../utilities/smsMapper";
// import sendSms from "../utilities/sendSms";
// import sendMessage from "../utilities/sendMessage";
// import consumer from "../utilities/consumer";

import { cartDTO, cartInputDTO } from "../dto/orders/cartDTO";
import cartService from "../services/orders/cartService";

class cartController {
  private static instance: cartController;
  cartService: cartService;

  private constructor() {
    this.cartService = new cartService();
    // this.orderService = new OrderService()
    // this.userService = new UserService()
  }

  static getInstance(): cartController {
    if (!cartController.instance) {
      cartController.instance = new cartController();
    }
    return cartController.instance;
  }
  async getAllCarts(req: Request, res: Response): Promise<void> {
    try {
      const cart: cartDTO[] = await this.cartService.getAllCart();
      // sendMessage("order-topic", JSON.stringify(orders))
      res.status(200).json(cart);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get orders", error: error.message });
    }
  }
  async createCart(req: Request, res: Response): Promise<void> {
    try {
      const cartInput: cartInputDTO = req.body;
      const createdCart = await this.cartService.createCart(cartInput);
      if (createdCart) {
        res.status(200).json(createdCart);
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to add to cart", error: error.message });
    }
  }
  async deleteCartProduct(req: Request, res: Response): Promise<void> {
    try {
      const CartID: string = req.params.id;
      const productId: string = req.body.productId;
      const productSize: string = req.body.size;
      const deletedCartItem = await this.cartService.deleteCartProduct(
        productId,
        CartID,
        productSize,
      );

      res.status(200).json(deletedCartItem);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to delete to cart", error: error.message });
    }
  }
  async getCartByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req?.query?.userId as string | undefined;
      if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const cartItem: cartDTO | null =
        await this.cartService.getCartByUserId(userId);
      if (cartItem) {
        res.status(200).json(cartItem);
      } else {
        res.status(404).json({ message: "Cart not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get cart", error: error.message });
    }
  }
  async updateCart(req: Request, res: Response): Promise<void> {
    try {
      const CartID: string = req.params.id;
      const cartInput: cartInputDTO = req.body;
      const updateCart: cartDTO | null = await this.cartService.updateCart(
        CartID,
        cartInput,
      );
      if (updateCart) {
        res.status(200).json(updateCart);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to update cart", error: error.message });
    }
  }
  async deleteCart(req: Request, res: Response): Promise<void> {
    try {
      const CartId: string = req.params.id;
      const deletedCart: any = await this.cartService.deleteCart(CartId);
      console.log(deletedCart, "deletedCart");
      res.status(200).json({ message: "Cart has been deleted" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to delete cart", error: error.message });
    }
  }
}
export default cartController;
