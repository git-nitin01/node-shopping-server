import express, { Request, Response } from "express";
import multer from "multer";
import ProductController from "../controllers/products/product.controller";
import {
  validateProductIdParam,
  validateProductPostBody,
} from "../middlewares/product/productMiddleware";
import { validateImageUpload } from "../middlewares/Products/ProductsCategoryMiddleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const productController = ProductController.getInstance();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     price:
 *                       type: number
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     inStock:
 *                       type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       400:
 *         description: Invalid request body
 */
router.post(
  "/",
  upload.any(),
  validateProductPostBody,
  async (req: Request, res: Response) => {
    await productController.createProduct(req, res);
  },
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     price:
 *                       type: number
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                     inStock:
 *                       type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  upload.single("image"),
  validateImageUpload,
  validateProductIdParam,
  async (req: Request, res: Response) => {
    await productController.updateProduct(req, res);
  },
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  validateProductIdParam,
  async (req: Request, res: Response) => {
    await productController.deleteProduct(req, res);
  },
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDTO'
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  validateProductIdParam,
  async (req: Request, res: Response) => {
    await productController.getProductById(req, res);
  },
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductDTO'
 */
router.get("/", async (req: Request, res: Response) => {
  await productController.getAllProducts(req, res);
});

export default router;
