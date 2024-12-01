/* eslint-disable @typescript-eslint/no-explicit-any */
// import { orderItemInputDTO } from "../../dto/orders/orderItemsDTO";
import { ProductDTO } from "../../dto/products/ProductDTO";
// import { orderDTO, orderInputDTO } from "../../dto/orders/orderDTO";
// import { Order } from "../../models/sql/ordersManagement/order.model";
// import { OrderItem } from "../../models/sql/ordersManagement/orderItems.model";
import ProductService from "../products/ProductService";
import { sequelize } from "../../config/mySql";
import { cartDTO, cartInputDTO } from "../../dto/orders/cartDTO";
import { Cart } from "../../models/sql/ordersManagement/cart.model";
import { CartItem } from "../../models/sql/ordersManagement/cartItems.model";
import { cartInputItemInputDTO } from "../../dto/orders/cartItemsDTO";

class cartService {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // GET ALL cart
  public async getAllCart(): Promise<cartDTO[]> {
    const carts = await Cart.findAll();

    // Assuming each order has an array of orderItems, you need to fetch order items for each order
    const cartDTOsPromises = carts.map(async (cart: any) => {
      const cartItems = await this.getcartItemsByOrderId(cart.CartID);
      return this.mapCartToDTO(cart, cartItems);
    });

    const cartDTos: cartDTO[] = await Promise.all(cartDTOsPromises);
    return cartDTos;
  }

  // CREATE a new order
  public async createCart(cartInput: cartInputDTO): Promise<cartDTO | null> {
    const t = await sequelize.transaction();

    try {
      // Find existing order for the given user
      const existingCart = await Cart.findOne({
        where: { userId: cartInput?.userId },
        transaction: t,
      });

      let createdCartId: string;

      if (existingCart) {
        // Order exists, use its ID
        createdCartId = existingCart.dataValues.CartID;
        console.log(`Existing cart found with ID: ${createdCartId}`);

        // Update or create order items
        await Promise.all(
          cartInput.Products.map(async (prodData: any) => {
            await this.createOrUpdateCartItem(
              t,
              createdCartId,
              prodData,
              "create",
            );
          }),
        );
      } else {
        // No existing order found, create a new order
        console.log("No existing order found. Creating a new order.");
        const newOrder = await Cart.create(cartInput as any, {
          transaction: t,
        });
        createdCartId = newOrder.dataValues.CartID;
        console.log(`Created new order with ID: ${createdCartId}`);

        // Create order items for the new order
        await Promise.all(
          cartInput.Products.map(async (prodData: any) => {
            await this.createCartItem(t, createdCartId, prodData);
          }),
        );
      }

      await t.commit();
      return this.getCartById(createdCartId);
    } catch (error) {
      await t.rollback();
      console.error("Failed to create order:", error);
      throw new Error("Failed to create order");
    }
  }

  public createCartItem = async (
    transaction: any,
    CartID: string,
    prodData: any,
  ): Promise<void> => {
    const sampleData: cartInputItemInputDTO = {
      CartID: CartID,
      ProductID: prodData?.productID,
      Quantity: prodData?.Quantity,
      unitPrice: prodData?.unitPrice,
      size: prodData?.size,
    };
    const newOrderItem = await CartItem.create(sampleData as any, {
      transaction: transaction,
    });
    console.log(`Created new OrderItem: ${newOrderItem}`);
  };

  public createOrUpdateCartItem = async (
    transaction: any,
    CartID: string,
    prodData: any,
    type: string,
  ): Promise<void> => {
    const existingCartItem = await CartItem.findOne({
      where: {
        CartID: CartID,
        ProductID: prodData?.productID,
        size: prodData?.size,
      },
      transaction: transaction,
    });
    if (existingCartItem) {
      // Update existing order item
      const updatedQuantity =
        type === "create"
          ? existingCartItem.dataValues.Quantity + prodData?.quantity
          : prodData?.quantity;

      await CartItem.update(
        {
          Quantity: updatedQuantity,
        },
        {
          where: {
            CartID: CartID,
            ProductID: prodData?.productID,
            size: prodData?.size,
          },
          transaction: transaction,
        },
      );
    } else {
      // Create new order item
      await this.createCartItem(transaction, CartID, prodData);
    }
  };

  public async getCartById(CartID: string): Promise<cartDTO | null> {
    const cart = await Cart.findByPk(CartID);
    const cartItems = await CartItem.findAll({
      where: { CartID: CartID },
    });

    return cart ? this.mapCartToDTO(cart, cartItems) : null;
  }

  public async getCartByUserId(userId: string): Promise<cartDTO | null> {
    const existingCart = await Cart.findOne({
      where: { userId: userId },
    });
    if (existingCart) {
      const cartItems = await CartItem.findAll({
        where: { CartID: existingCart?.dataValues?.CartID },
      });
      return this.mapCartToDTO(existingCart, cartItems);
    } else {
      return {
        CartID: 0,
        userId: userId,
        totalQuantity: 0,
        products: [],
      };
    }
  }

  public async getProductById(productId: string): Promise<ProductDTO | null> {
    const products = await this.productService.getProductById(productId);
    return products;
  }

  private async getcartItemsByOrderId(CartID: string): Promise<any[]> {
    return CartItem.findAll({ where: { CartID: CartID } });
  }

  // UPDATE an existing cart
  public async updateCart(
    CartID: string,
    cartInput: cartInputDTO,
  ): Promise<cartDTO | null> {
    if (cartInput.Products?.length > 0) {
      // Update or create cart items
      await Promise.all(
        cartInput.Products.map(async (prodData: any) => {
          await this.createOrUpdateCartItem(null, CartID, prodData, "update");
        }),
      );
    }
    return this.getCartById(CartID);
  }

  public async deleteCart(CartID: string): Promise<void> {
    await CartItem.destroy({ where: { CartID: CartID } });
    await Cart.destroy({ where: { CartID: CartID } });
  }
  public async deleteCartProduct(
    productId: string,
    CartID: string,
    productSize: string,
  ): Promise<void> {
    await CartItem.destroy({
      where: { ProductID: productId, CartID: CartID, size: productSize },
    });
  }

  private async mapCartToDTO(cart: any, cartItems?: any): Promise<cartDTO> {
    let totalQuantity = 0;

    if (!cart) {
      throw new Error("Invalid cart object");
    }

    let products: any[] = [];

    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const productDetailsPromises: Promise<any>[] = [];

      for (const item of cartItems) {
        totalQuantity += item.Quantity;
        const defaultSizes: {
          size: string;
          price: number;
          images: string[];
          inStock: boolean;
        }[][] = [];
        if (item && item.ProductID) {
          const productDetailsPromise = this.getProductById(
            item.ProductID,
          ).then((productDetails) => {
            if (productDetails) {
              defaultSizes.push(productDetails?.sizes);
              // Find the size object that matches the cart item's size
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
                },
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

      products = await Promise.all(productDetailsPromises);
    }

    return {
      CartID: cart.CartID,
      userId: cart.userId,
      totalQuantity: totalQuantity,
      products: products,
    };
  }
}

export default cartService;
