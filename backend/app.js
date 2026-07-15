// import dotenv from 'dotenv';
// dotenv.config(); // Ye line hona sabse zaroori hai

// import express from 'express';
// import dbConnect from './connect/dbConnect.js';
// import userRouter from './routes/userRouter.js';
// import productRouter from "./routes/productRouter.js"
// import fileUpload from 'express-fileupload';
// import cartRoutes from './routes/cartRoutes.js';
// import cors from 'cors';

// const app= express()
// app.use(express.json())
// app.use(cors())
// app.use(fileUpload())

// const port = 4888;
// dbConnect()
// app.use("/User",userRouter)
// app.use("/product",productRouter)
// app.use('/api/cart', cartRoutes);
// app.listen(port,()=>{
//     console.log(`Server is running on ${port}`)
// })

import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import dbConnect from './connect/dbConnect.js';
import userRouter from './routes/userRouter.js';
import productRouter from "./routes/productRouter.js"; // Sahi import
import fileUpload from 'express-fileupload';
import cartRouter from './routes/cartRouter.js';
import orderRouter from "./routes/orderRouter.js";
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Aapke dono frontend ports allowed
    credentials: true
}));
app.use(fileUpload());

const port = 4888;

// Database Connection
dbConnect(); // Make sure dbConnect uses process.env.MONGO_URL internally

// Routes
app.use("/User", userRouter);
app.use("/product", productRouter); // Fixed this line
app.use('/cart', cartRouter);
app.use("/order",orderRouter)
// 🔥 Ise apni server.js mein top par add/update karo
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    // Debugging ke liye check karein URL kya mil raha hai
    console.log("DB URL from Env:", process.env.MONGO_URI); 
});