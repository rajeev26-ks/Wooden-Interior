// // import express from "express";
// // import { addProduct, getProducts } from "../controller/productController.js";

// // const router = express.Router();

// // router.post("/add", addProduct);      // Product add karne ke liye
// // router.get("/getall", getProducts);   // Products fetch karne ke liye

// // export default router;
// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { addProduct, getProducts } from "../controller/productController.js";

// const router = express.Router();

// // Auto folder creation checkpoint
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Storage configurations
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// // Route mapping
// router.post("/add", upload.single("img"), addProduct);
// router.get("/all", getProducts);

// export default router;


import express from "express";
import { addProduct, getProducts, deleteProduct, updateProduct } from "../controller/productController.js";

const router = express.Router();

// 🔥 No Multer, directly inject values to controller logic stack
router.post("/add", addProduct);
router.get("/all", getProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);

export default router;