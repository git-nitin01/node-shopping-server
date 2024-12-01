import { ProductDTO } from "../products/ProductDTO";
export interface orderDTO {
  orderID: number;
  userId: string;
  pointsUsed: number;
  totalAmount: string;
  orderDate: Date;
  deliveryAddressId: number;
  paymentId: number;
  status: string;
  products?: OrderItemDTO[];
}
interface OrderItemDTO {
  quantity: number;
  subTotal: number;
  productDetails?: ProductDTO;
}
export interface orderInputDTO {
  userId: string;
  pointsUsed: number;
  totalAmount: string;
  orderDate: Date;
  deliveryAddressId: number;
  paymentId: number | null;
  status: string;
  Products: [
    {
      productID: string;
      Quantity: number;
      UnitPrice: number;
      subTotal: number;
    },
  ];
}
