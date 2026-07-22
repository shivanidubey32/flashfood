import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [{
    name: String,
    qty: Number,
    price: Number,
  }],
  totalPrice: Number,
  isPaid: Boolean,
  status: { type: String, default: 'Pending' },
  pickupMethod: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  role: String
});

const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

const makeOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const customer = await User.findOne({ role: 'Customer' });
    const merchant = await User.findOne({ role: 'Merchant' });

    if (!customer || !merchant) {
      console.log("Could not find a Customer and a Merchant in the DB.");
      process.exit(1);
    }

    const order = new Order({
      customer: customer._id,
      merchant: merchant._id,
      orderItems: [{
        name: "Test Food Item",
        qty: 2,
        price: 150
      }],
      totalPrice: 315, // (150 * 2) + 5% tax
      isPaid: true,
      pickupMethod: 'Pickup',
      status: 'Ready'
    });

    await order.save();
    console.log("Successfully created test order for customer:", customer.name, "from merchant:", merchant.name);
    process.exit(0);
  } catch (error) {
    console.error("Error making order:", error);
    process.exit(1);
  }
};

makeOrder();
