// validations for address routes
import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

// address schema for validation
export const addressSchema = z.object({
  // regex for pincode validation
  pincode: z
    .string()
    .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Invalid ZIP code"),
});

// middleware for validation
export const validateAddress =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      schema.parse({
        pincode: req.body.pincode,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send({
          message: "Invalid request body",
          error: error.errors,
        });
      }
      next(error);
    }
  };
