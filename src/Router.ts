import { Request, Response, Router } from "express";
// import OrderRoutes from "./routes/order.routes";
// import ProductRoutes from "./routes/product.routes";
import InventoryRoutes from "./routes/inventory.routes";
import OfferRoutes from "./routes/Offers.routes";
import ReviewRoutes from "./routes/review.routes";
import CategoryRoutes from "./routes/category.routes";
import UserPointsRouters from "./routes/user/userPoints.routes";
import UserAddressRouters from "./routes/user/userAddress.routes";
import UserRouters from "./routes/user/user.routes";
import cartRoutes from "./routes/cart.routes";
import paymentRoutes from "./routes/payment.routes";
import orderRoutes from "./routes/order.routes";

const router = Router();
// Health Check
router.get("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.send("Server is running");
});
// Routes
router.use("/orders", orderRoutes);
router.use("/cart", cartRoutes);
// router.use("/products", ProductRoutes);
router.use("/inventory", InventoryRoutes);
router.use("/offer", OfferRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/categories", CategoryRoutes);
router.use("/user", UserRouters);
router.use("/user/points", UserPointsRouters);
router.use("/user/address", UserAddressRouters);
router.use("/payment", paymentRoutes);

export default router;
