/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.Mixed,
    ref: "Category",
    default: "",
  },
  isPopular: { type: Boolean, default: false },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      images: [{ type: String, required: true }],
      inStock: { type: Boolean, required: true },
      isPopular: { type: Boolean, default: false },
      subTitle: { type: String },
    },
  ],
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});

productSchema.pre("save", function preSave() {
  const product = this;
  product.id = product._id.toString();
});

categorySchema.pre("save", function preSave() {
  const category = this;
  category.id = category._id.toString();
});

reviewSchema.pre("save", function preSave() {
  const review = this;
  review.id = review._id.toString();
});

const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Review = mongoose.model("Review", reviewSchema);

export { Product, Category, Review };
