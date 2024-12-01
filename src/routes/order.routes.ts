import express, { Request, Response } from "express";
import OrderController from "../controllers/order.controller";
import {
  validateOrder,
  validateOrderId,
} from "../middlewares/orderManagementMiddleware/orderMiddleware";
import { orderSchema } from "../schemas/orderManagementSchema/orderSchema";
import { validateUserID } from "../middlewares/orderManagementMiddleware/cartMiddleware";

const router = express.Router();
const orderController = OrderController.getInstance();
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/OrderDTO"
 */
router.get("/", async (req: Request, res: Response) => {
  await orderController.getAllorders(req, res);
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/orderInputDTO"
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDTO"
 */
router.post(
  "/",
  validateOrder(orderSchema),
  async (req: Request, res: Response) => {
    await orderController.createOrder(req, res);
  },
);

/**
 * @swagger
 * /orders/byUserId:
 *   get:
 *     summary: Get order by userId
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDTO"
 *       404:
 *         description: Order not found
 */
router.get(
  "/byUserID",
  validateUserID(),
  async (req: Request, res: Response) => {
    await orderController.getOrderByUserId(req, res);
  },
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by order ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDTO"
 *       404:
 *         description: Order not found
 */
router.get("/:id", validateOrderId(), async (req: Request, res: Response) => {
  await orderController.getOrderById(req, res);
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/orderInputDTO"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderDTO"
 *       404:
 *         description: Order not found
 */
// UPDATE an existing order
router.put(
  "/:id",
  validateOrder(orderSchema),
  async (req: Request, res: Response) => {
    await orderController.updateOrder(req, res);
  },
);
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *
 *                description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete(
  "/:id",
  validateOrderId(),
  async (req: Request, res: Response) => {
    await orderController.deleteOrder(req, res);
  },
);

export default router;
