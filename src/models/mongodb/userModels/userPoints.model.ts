import mongoose from "mongoose";
import { userPointsDTO } from "../../../dto/Users/userPointsDTO";

// getting schema class from mongoose
const { Schema } = mongoose;

// creating userPoints schema
const userPointsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    requried: true,
  },
  userDesctiption: {
    type: String,
  },
  date: {
    type: Date,
    immutable: true,
  },
  referralUserId: {
    type: String,
    default: null,
  },
  reason: {
    type: String,
    default: null,
  },
});

// creating userPoints model
const userPoints = mongoose.model<userPointsDTO>(
  "UserPoints",
  userPointsSchema,
);

export default userPoints;
