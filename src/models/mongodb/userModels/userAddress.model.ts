import mongoose from "mongoose";
import { userAddressDTO } from "../../../dto/Users/userAddressDTO";

// getting schema class from mongoose
const { Schema } = mongoose;

// creating userAddress schema
const userAddressSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  defaultAddress: {
    type: Boolean,
    default: false,
  },
  pref: {
    type: String,
  },
});

// creating userAddress model
const userAddress = mongoose.model<userAddressDTO>(
  "UserAddress",
  userAddressSchema,
);

export default userAddress;
