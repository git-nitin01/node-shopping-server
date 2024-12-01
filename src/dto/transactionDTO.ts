type Transaction = {
  transactionId?: number;
  uid: string;
  productId?: string;
  date: string;
  type: string;
  amount?: number;
  points?: number;
  comments?: string;
};

export default Transaction;
