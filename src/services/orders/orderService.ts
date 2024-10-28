/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderItemInputDTO } from "../../dto/orders/orderItemsDTO";
import { ProductDTO } from "../../dto/products/ProductDTO";
import { orderDTO, orderInputDTO } from "../../dto/orders/orderDTO";
import { Order } from "../../models/sql/ordersManagement/order.model";
import { OrderItem } from "../../models/sql/ordersManagement/orderItems.model";
import ProductService from "../products/ProductService";
import { sequelize } from "../../config/mySql";
class OrderService {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  // GET ALL orders
  public async getAllOrders(): Promise<orderDTO[]> {
    const orders = await Order.findAll();

    // Assuming each order has an array of orderItems, you need to fetch order items for each order
    const orderDTOsPromises = orders.map(async (order: any) => {
      const orderItems = await this.getOrderItemsByOrderId(order.OrderId);
      // Replace this with your actual method to get order items
      return this.mapOrderToDTO(order, orderItems);
    });

    const orderDTOs: orderDTO[] = await Promise.all(orderDTOsPromises);
    return orderDTOs;
  }
  // CREATE a new order
  public async createOrder(
    orderInput: orderInputDTO,
  ): Promise<orderDTO[] | null> {
    const t = await sequelize.transaction();

    try {
      console.log("Creating order with input:", orderInput);
      // Find existing order for the given user
      const existingOrder = await Order.findOne({
        where: { userId: orderInput?.userId },
        transaction: t,
      });

      let createdOrderID: string;

      if (existingOrder) {
        // Order exists, use its ID
        createdOrderID = existingOrder.dataValues.OrderId;
        console.log(`Existing order found with ID: ${createdOrderID}`);

        // Update or create order items
        await Promise.all(
          orderInput.Products.map(async (prodData: any) => {
            await this.createOrUpdateOrderItem(t, createdOrderID, prodData);
          }),
        );
      } else {
        // need to remove once mapping is correct
        const orderData = {
          userId: orderInput.userId,
          PointsUsed: orderInput.pointsUsed,
          TotalAmount: orderInput.totalAmount,
          OrderDate: orderInput.orderDate || new Date(),
          DeliveryAddressId: orderInput.deliveryAddressId || null,
          PaymentId: orderInput.paymentId || "",
          Status: orderInput.status || "Pending",
        };
        // No existing order found, create a new order
        console.log(
          "No existing order found. Creating a new order.",
          orderData,
        );
        const newOrder = await Order.create(orderData as any, {
          transaction: t,
        });
        createdOrderID = newOrder.dataValues.OrderId;
        console.log(`Created new order with ID: ${createdOrderID}`);

        // Create order items for the new order
        await Promise.all(
          orderInput.Products.map(async (prodData: any) => {
            await this.createOrderItem(t, createdOrderID, prodData);
          }),
        );
      }

      await t.commit();
      return this.getOrderByUserId(orderInput?.userId);
    } catch (error) {
      await t.rollback();
      console.error("Failed to create order:", error);
      throw new Error("Failed to create order");
    }
  }

  public async getOrderById(orderId: string): Promise<orderDTO | null> {
    try {
      const order = await Order.findByPk(orderId);
      if (!order) {
        return null;
      }

      const orderItems = await this.getOrderItemsByOrderId(orderId);
      return this.mapOrderToDTO(order, orderItems);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw new Error("Failed to fetch order by ID");
    }
  }

  public createOrderItem = async (
    transaction: any,
    orderID: string,
    prodData: any,
  ): Promise<void> => {
    const sampleData: orderItemInputDTO = {
      OrderID: orderID,
      ProductID: prodData?.productID,
      Quantity: prodData?.Quantity,
      UnitPrice: prodData?.UnitPrice,
      Subtotal: prodData?.subTotal,
      size: prodData?.size,
    };
    const newOrderItem = await OrderItem.create(sampleData as any, {
      transaction: transaction,
    });
    console.log(`Created new OrderItem: ${newOrderItem}`);
  };
  public createOrUpdateOrderItem = async (
    transaction: any,
    orderID: string,
    prodData: any,
  ): Promise<void> => {
    const existingOrderItem = await OrderItem.findOne({
      where: { OrderID: orderID, ProductID: prodData?.productID },
      transaction: transaction,
    });

    if (existingOrderItem) {
      // Update existing order item
      const updatedQuantity =
        existingOrderItem.dataValues.Quantity + prodData?.Quantity;
      const updatedSubtotal = (
        parseFloat(existingOrderItem.dataValues.Subtotal) +
        parseFloat(prodData?.subTotal)
      ).toFixed(2);

      await OrderItem.update(
        {
          Quantity: updatedQuantity,
          Subtotal: updatedSubtotal,
        },
        {
          where: { OrderID: orderID, ProductID: prodData?.productID },
          transaction: transaction,
        },
      );
    } else {
      // Create new order item
      await this.createOrderItem(transaction, orderID, prodData);
    }
  };

  public async getOrderByUserId(userId: string): Promise<orderDTO[] | null> {
    const currentDate = new Date();

    try {
      const existingOrders = await Order.findAll({
        where: { userId: userId },
      });

      if (existingOrders.length === 0) {
        // No orders found for the user
        return [
          {
            orderID: 0,
            userId: userId,
            pointsUsed: 0,
            totalAmount: "0",
            orderDate: currentDate,
            deliveryAddressId: 0,
            paymentId: 0,
            status: "",
            products: [],
          },
        ];
      }

      // Process each order and fetch related order items
      const orderDTOs = await Promise.all(
        existingOrders.map(async (order: any) => {
          const orderItems = await OrderItem.findAll({
            where: { OrderID: order.OrderId },
          });

          // Map the order and its items to the DTO
          return this.mapOrderToDTO(order, orderItems);
        }),
      );

      // Return the DTOs, you might need to adjust this based on your requirements
      return orderDTOs.length > 0 ? orderDTOs : null;
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle error and return null or an appropriate response
      return null;
    }
  }

  public async getProductById(productId: string): Promise<ProductDTO | null> {
    const products = await this.productService.getProductById(productId);
    return products;
  }

  private async getOrderItemsByOrderId(orderId: string): Promise<any[]> {
    return OrderItem.findAll({ where: { OrderId: orderId } });
  }

  // UPDATE an existing product
  public async updateOrder(
    orderId: string,
    orderInput: orderInputDTO,
  ): Promise<orderDTO[] | null> {
    const [updatedRowsCount] = await Order.update(orderInput, {
      where: { OrderId: orderId },
    });
    console.log(updatedRowsCount);

    if (updatedRowsCount > 0 && orderInput.Products?.length > 0) {
      // Delete existing order items
      await OrderItem.destroy({ where: { OrderID: orderId } });

      // Create new order items
      const orderItemsPromises = orderInput.Products.map(
        async (prodData: any) => {
          const sampleData: orderItemInputDTO = {
            OrderID: orderId,
            ProductID: prodData.productID,
            Quantity: prodData.Quantity,
            UnitPrice: prodData.UnitPrice,
            Subtotal: prodData.subTotal,
            size: prodData.size,
          };
          return OrderItem.create(sampleData as any);
        },
      );
      await Promise.all(orderItemsPromises);
    }
    return this.getOrderByUserId(orderInput?.userId);
  }
  public async deleteOrder(orderId: string): Promise<void> {
    await OrderItem.destroy({ where: { OrderID: orderId } });
    await Order.destroy({ where: { OrderID: orderId } });
  }
  private async mapOrderToDTO(order: any, orderItems?: any): Promise<orderDTO> {
    if (!order) {
      throw new Error("Invalid order object");
    }

    let products: any[] = [];

    if (Array.isArray(orderItems) && orderItems.length > 0) {
      const productDetailsPromises: Promise<any>[] = [];

      orderItems.forEach((item: any) => {
        const defaultSizes: {
          size: string;
          price: number;
          images: string[];
          inStock: boolean;
        }[][] = [];
        if (item && item.ProductID) {
          if (item && item.ProductID) {
            const productDetailsPromise = this.getProductById(
              item.ProductID,
            ).then((productDetails) => {
              if (productDetails) {
                defaultSizes.push(productDetails?.sizes);
                // Find the size object that matches the cart item"s size
                const sizeMatch = productDetails.sizes.filter(
                  (sizeObj: any) => sizeObj.size === item.size,
                );
                if (sizeMatch) {
                  // If a matching size is found, assign it to productDetails.sizes
                  productDetails.sizes = sizeMatch;
                } else {
                  // Handle the case where no matching size is found
                  productDetails.sizes = [];
                }

                return {
                  quantity: item.Quantity || 0,
                  productDetails: {
                    ...productDetails,
                    defaultSizes: defaultSizes,
                    imageURL: productDetails?.sizes[0]?.images[0],
                    price: productDetails?.sizes[0]?.price || 0,
                  },
                  subTotal: item.Subtotal || 0,
                };
              } else {
                return {
                  quantity: item.Quantity || 0,
                  productDetails: null,
                };
              }
            });
            productDetailsPromises.push(productDetailsPromise);
          }
        }
      });

      products = await Promise.all(productDetailsPromises);
    }

    return {
      orderID: order.OrderId,
      userId: order.userId,
      pointsUsed: order.PointsUsed,
      totalAmount: order.TotalAmount,
      orderDate: order.OrderDate,
      deliveryAddressId: order.DeliveryAddressId,
      paymentId: order.PaymentId,
      status: order.Status,
      products: products,
    };
  }
}

export default OrderService;
