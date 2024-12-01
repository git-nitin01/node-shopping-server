import mongoose from "mongoose";
import { Product, Review } from "../models/mongodb/products.model";

export const updateProducts = async (): Promise<void> => {
  try {
    const products = await Product.find();
    for (const product of products) {
      const reviews = await Review.find({ productId: product._id });
      if (reviews.length > 0) {
        const ratingSum = reviews.reduce(
          (acc, review) => acc + review.rating,
          0,
        );
        const avgRating = ratingSum / reviews.length;
        const ratingCount = reviews.length;

        // Update the product with the new fields
        await Product.findByIdAndUpdate(product._id, {
          averageRating: avgRating,
          ratingCount: ratingCount,
        });
      } else {
        // If no reviews, set default values
        await Product.findByIdAndUpdate(product._id, {
          averageRating: 0,
          ratingCount: 0,
        });
      }
    }

    console.log("Product documents updated successfully.");
  } catch (error) {
    console.error("Error updating product documents:", error);
  } finally {
    mongoose.connection.close(); // Close the connection when done
  }
};
const uri = process.env.MONGODB_URI || "";

mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Connected to MongoDB");
    updateProducts(); // Run the update function
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
