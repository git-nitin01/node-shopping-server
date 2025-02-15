/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable quotes */
const mongoose = require("mongoose");

const ProducrSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    size: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProducrSchema);
