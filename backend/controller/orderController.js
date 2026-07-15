import orderSchema from "../model/orderSchema.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  // Frontend se saare form attributes strictly receive ho rahe hain
  const { userId, fullName, email, phone, address, city, pincode, cartItems, totalAmount } = req.body;

  try {
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart khali hai!" });
    }

    const productTitles = cartItems.map(item => `${item.title} (x${item.quantity})`).join(", ");
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

    // Filter numerical value to keep things safe
    const numericAmount = Number(String(totalAmount).replace(/[^\d.]/g, '')) || 0;

    // 🔥 Mongoose schema parameters exact name synchronization matrix
    const newOrder = new orderSchema({
      customer: isValidObjectId ? userId : null,
      customerName: fullName,   
      email: email, 
      product: productTitles,   
      amount: numericAmount, 
      status: 'Pending'          
    });

    // Save to Database
    const savedOrder = await newOrder.save();
    console.log("Database mein order securely create ho gaya:", savedOrder._id);

    // --- Automated Email Notification Sequence ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: { 
        user: "rs2652002@gmail.com", 
        pass: "qlyh fzfr qkwc yefx" 
      },
    });

    const itemsHtml = cartItems.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${item.price}</td>
      </tr>
    `).join("");

    // Dynamic Indian Currency Locale Formatting for Total
    const formattedTotalAmount = `$${numericAmount.toLocaleString('en-IN')}`;

    const mailOptions = {
      from: '"Wooden Interior" <rs2652002@gmail.com>',
      to: email, 
      subject: `Order Inquiry Received #${savedOrder._id.toString().substring(18).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #a66d3b; text-align: center;">WOODEN INTERIOR</h2>
          <p>Hi <strong>${fullName}</strong>,</p>
          <p>We received your inquiry for the following premium selection:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8f1e9;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <p><strong>Total Amount:</strong> ${formattedTotalAmount}</p>
          <p>Our executive will contact you on +91 ${phone} very soon!</p>
        </div>
      `,
    };

    // Isolated Nodemailer Try-Catch block so connection timeout doesn't undo schema operations
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Nodemailer Mail delivery delayed trace:", mailError);
      return res.status(200).json({ 
        success: true, 
        message: "Order received, notification mail will be pushed soon.", 
        orderId: savedOrder._id 
      });
    }

    return res.status(200).json({ success: true, message: "Order processed completely!", orderId: savedOrder._id });

  } catch (error) {
    console.error("Critical placement processing error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server setup validation failure." });
  }
};

// Is naam ko dhyan se check karein: deleteOrderRecord
export const deleteOrderRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await orderSchema.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Order deleted from database." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting row." });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderSchema.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching data grid." });
  }
};

// 🔄 Admin Endpoint: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await orderSchema.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(200).json({ success: true, message: "Status updated!", updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error changing status." });
  }
};