import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: { type: String },
    title: { type: String, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;