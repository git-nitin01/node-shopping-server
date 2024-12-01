import Transaction from "../dto/transactionDTO";
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: Number,
    default: 1,
  },
  uid: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  points: {
    type: Number,
  },
  comments: {
    type: String,
  },
});

const transactionModel = mongoose.model<Transaction>(
  "Transaction",
  transactionSchema,
);

transactionSchema.pre("save", function (next) {
  if (this.isNew) {
    transactionModel.countDocuments().then((count) => {
      this.transactionId = count + 1;
    });
  }
  next();
});

export default transactionModel;
