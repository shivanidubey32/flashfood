import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        listing: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'FoodListing',
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    pickupMethod: {
      type: String,
      enum: ['Pickup', 'Delivery'],
      default: 'Pickup',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
