import { DataTypes } from "sequelize";
import { OrderItem } from "./orderItems.model";
import { sequelize } from "../../../config/mySql";

const Order = sequelize.define(
  "Order",
  {
    OrderId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PointsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    TotalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    OrderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    DeliveryAddressId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    PaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "Order",
    timestamps: false,
  },
);
Order.hasMany(OrderItem, { foreignKey: "OrderId", as: "OrderItems" });
export { Order };
