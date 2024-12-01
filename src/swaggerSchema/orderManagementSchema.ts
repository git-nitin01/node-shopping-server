// src/swaggerSchema/orderManagementSchema.ts

export const orderSchemaDTO = {
  type: "object",
  properties: {
    orderID: {
      type: "integer",
    },
    userId: {
      type: "string",
    },
    pointsUsed: {
      type: "integer",
    },
    totalAmount: {
      type: "string",
      format: "decimal",
    },
    orderDate: {
      type: "string",
      format: "date-time",
    },
    deliveryAddressId: {
      type: "integer",
      nullable: true,
    },
    paymentId: {
      type: "string",
      nullable: true,
    },
    status: {
      type: "string",
      enum: ["Delivered", "Shipped", "Pending"],
      default: "Pending",
    },
    products: {
      type: "array",
      items: {
        $ref: "#/components/schemas/ProductDTO",
      },
    },
  },
};

export const orderInputSchemaDTO = {
  title: "Order",
  type: "object",
  properties: {
    userId: {
      type: "string",
    },
    PointsUsed: {
      type: "number",
    },
    TotalAmount: {
      type: "string",
    },
    DeliveryAddressID: {
      type: "string",

      nullable: true,
    },
    PaymentID: {
      type: "string",
      nullable: true,
    },
    Status: {
      type: "string",
      enum: ["pending", "shipped", "delivered"],
    },
    Products: {
      type: "array",
      items: {
        type: "object",
        properties: {
          productID: {
            type: "string",
          },
          Quantity: {
            type: "number",
          },
          UnitPrice: {
            type: "number",
            format: "double",
          },
          subTotal: {
            type: "number",
            format: "double",
          },
        },
        required: ["productID", "Quantity", "UnitPrice", "subTotal"],
      },
    },
  },
  required: ["userId", "PointsUsed", "TotalAmount", "Status", "Products"],
};
