// import Product from "../model/productSchema.js";

// export const addProduct = async (req, res) => {
//     try {
//         // Schema ke hisaab se sirf ye 4 cheezein nikaal rahe hain
//         const { title, category, img, price } = req.body;

//         // Naya product create ho raha hai
//         const newProduct = new Product({
//             title,
//             category,
//             img,
//             price: price || 0 // Agar price nahi aayi toh 0 save hoga
//         });

//         // MongoDB Atlas mein save kar rahe hain
//         const savedProduct = await newProduct.save();

//         res.status(201).json({
//             success: true,
//             message: "Product added to Furniture Database!",
//             data: savedProduct
//         });
//     } catch (error) {
//         console.error("Backend Error:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Database mein save nahi ho paya",
//             error: error.message
//         });
//     }
// };

// // Saare products fetch karne ke liye (GET API)
// export const getProducts = async (req, res) => {
//     try {
//         const allProducts = await Product.find();
//         res.status(200).json(allProducts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

import Product from "../model/productSchema.js";

export const addProduct = async (req, res) => {
    try {
        const { title, category, price, stockQuantity, description, img } = req.body;

        if (!img) {
            return res.status(400).json({ success: false, message: "Image link is mandatory!" });
        }

        const newProduct = new Product({
            title: title ? title.trim() : "Untitled Wooden Design",
            category: category,
            price: Number(price) || 0,
            stockQuantity: Number(stockQuantity) || 0,
            description: description ? description.trim() : "",
            img: img.trim() // Saves direct URL into MongoDB Atlas collection array
        });

        await newProduct.save();
        return res.status(201).json({ success: true, message: "Product linked via internet URL successfully!" });

    } catch (error) {
        console.error("🔴 Backend Controller Save Error:", error);
        return res.status(500).json({ success: false, message: "Database storage error", error: error.message });
    }
};


export const getProducts = async (req, res) => {
    try {
        const allProducts = await Product.find().sort({ createdAt: -1 });
        return res.status(200).json(allProducts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// 🔥 REMOVE CONTROLLER FLOW ENGINE
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const targetProduct = await Product.findById(id);
        if (!targetProduct) {
            return res.status(404).json({ success: false, message: "Item not found in database catalog!" });
        }

        // Direct delete command run configuration 
        await Product.findByIdAndDelete(id);

        return res.status(200).json({ 
            success: true, 
            message: "Product completely deleted from master collection layer!" 
        });

    } catch (error) {
        console.error("🔴 Backend Controller Delete Process Failure:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Database erasure error trace triggered", 
            error: error.message 
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // URL se product ki id milegi
        const { title, price, category, img } = req.body; // Frontend se naya data milega

        // MongoDB mein find karo aur naye data ke sath update karo
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    price,
                    category,
                    img
                }
            },
            { new: true } // Isse database hume update hone ke baad ka fresh data return karega
        );

        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product nahi mila!" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Product successfully update ho gaya!",
            updatedProduct
        });

    } catch (error) {
        console.error("Backend update route error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server par update karte waqt error aaya!", 
            error: error.message 
        });
    }
};