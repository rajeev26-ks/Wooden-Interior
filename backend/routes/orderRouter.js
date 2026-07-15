import express from 'express';
import { placeOrder, getAllOrders, updateOrderStatus, deleteOrderRecord } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', placeOrder);
orderRouter.get('/all', getAllOrders);
orderRouter.put('/update-status/:id', updateOrderStatus);
orderRouter.delete('/delete/:id', deleteOrderRecord);

export default orderRouter;