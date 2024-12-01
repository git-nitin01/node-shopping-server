import { Request, NextFunction, Response } from "express";
import {
  idParamSchema,
  productPostBodySchema,
} from "../../schemas/ProductMangementSchema/productSchema";
import { ZodError } from "zod";
import { Product, Review } from "../../models/mongodb/products.model";
import mongoose from "mongoose";

const validateProductPostBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    productPostBodySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      res.status(400).json({ error: "Invalid data", details: errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const validateProductIdParam = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      idParamSchema.parse(id);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} ${issue.message}`,
        }));
        res.status(400).json({ error: "Invalid  Id", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};

const updateProductRatings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId } = req.params;

    const aggregationResult = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (aggregationResult.length > 0) {
      const { avgRating, count } = aggregationResult[0];

      await Product.findByIdAndUpdate(productId, {
        averageRating: avgRating,
        ratingCount: count,
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update product ratings",
      error: error.message,
    });
  }
};

export {
  validateProductPostBody,
  validateProductIdParam,
  updateProductRatings,
};
