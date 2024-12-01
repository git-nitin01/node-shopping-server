import { Request, Response } from "express";
import ReviewService from "../../services/products/ReviewService";
import { ReviewDTO, ReviewInputDTO } from "../../dto/products/reviewDTO";
import { updateProductRatings } from "../../middlewares/product/productMiddleware";

class ReviewController {
  private static instance: ReviewController;
  private reviewService: ReviewService;

  private constructor() {
    this.reviewService = new ReviewService();
  }

  static getInstance(): ReviewController {
    if (!ReviewController.instance) {
      ReviewController.instance = new ReviewController();
    }
    return ReviewController.instance;
  }

  // CREATE a new review by productId
  async createReviewByProductId(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params; // Get the productId from route params
      const reviewInput: ReviewInputDTO = { ...req.body, productId }; // Add productId to the review data
      const createdReview: ReviewDTO =
        await this.reviewService.createReview(reviewInput);
      await updateProductRatings(req, res, () => {
        res.status(201).json(createdReview);
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to create review", error: error.message });
    }
  }

  // Other methods remain unchanged...

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewId: string = req.params.id;
      const reviewInput: ReviewInputDTO = req.body;
      const updatedReview: ReviewDTO | null =
        await this.reviewService.updateReview(reviewId, reviewInput);
      if (updatedReview) {
        res.status(200).json(updatedReview);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to update review", error: error.message });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewId: string = req.params.id;
      await this.reviewService.deleteReview(reviewId);
      res.status(200).json({ message: "Review has been deleted" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to delete review", error: error.message });
    }
  }

  async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const reviewId: string = req.params.id;
      const review: ReviewDTO | null =
        await this.reviewService.getReviewById(reviewId);
      if (review) {
        res.status(200).json(review);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get review", error: error.message });
    }
  }

  async getAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const reviews: ReviewDTO[] = await this.reviewService.getAllReviews();
      res.status(200).json(reviews);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get reviews", error: error.message });
    }
  }

  async getReviewsByProductId(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const reviews: ReviewDTO[] =
        await this.reviewService.getReviewsByProductId(productId);
      res.status(200).json(reviews);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Failed to get reviews", error: error.message });
    }
  }
}

export default ReviewController;
