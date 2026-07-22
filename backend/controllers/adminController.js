import User from '../models/User.js';
import GlobalSettings from '../models/GlobalSettings.js';
import FoodListing from '../models/FoodListing.js';
import Order from '../models/Order.js';
import Donation from '../models/Donation.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

// --- PHASE 1 ---

export const getAdminStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'Customer' });
    const totalMerchants = await User.countDocuments({ role: 'Merchant' });
    const totalNGOs = await User.countDocuments({ role: 'NGO' });
    
    // Dynamic Phase 2 stats
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    // Calculate food saved (rough estimate: each item qty * 0.5 kg for demo)
    let totalFoodSaved = 0;
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        totalFoodSaved += item.qty * 0.5;
      });
    });

    const totalDonations = await Donation.countDocuments({ status: 'Completed' });
    const mealsRescued = totalDonations * 20; // estimate 20 meals per bulk donation

    // Calculate chart data for the last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = days.map(day => ({ name: day, revenue: 0, waste: 0, meals: 0, orders: 0 }));
    
    orders.forEach(order => {
      const dayName = days[new Date(order.createdAt).getDay()];
      const dayData = chartData.find(d => d.name === dayName);
      if (dayData) {
        dayData.revenue += order.totalPrice;
        dayData.orders += 1;
        dayData.waste += order.orderItems.reduce((sum, item) => sum + (item.qty * 0.5), 0);
      }
    });

    const impactDistribution = [
      { name: 'Cooked Meals', value: Math.round(totalFoodSaved * 0.4) },
      { name: 'Groceries', value: Math.round(totalFoodSaved * 0.35) },
      { name: 'Baked Goods', value: Math.round(totalFoodSaved * 0.25) },
    ];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newCustomers = await User.countDocuments({ role: 'Customer', createdAt: { $gte: sevenDaysAgo } });
    const newMerchants = await User.countDocuments({ role: 'Merchant', createdAt: { $gte: sevenDaysAgo } });
    const newNGOs = await User.countDocuments({ role: 'NGO', createdAt: { $gte: sevenDaysAgo } });

    const recentRevenue = orders
      .filter(o => new Date(o.createdAt) >= sevenDaysAgo)
      .reduce((acc, order) => acc + order.totalPrice, 0);

    const revenueGrowth = totalRevenue === 0 ? 0 : Math.round((recentRevenue / (totalRevenue || 1)) * 100);

    res.json({
      totalCustomers,
      totalMerchants,
      totalNGOs,
      totalOrders,
      totalFoodSaved: Math.round(totalFoodSaved),
      mealsRescued,
      totalRevenue: Math.round(totalRevenue),
      chartData,
      impactDistribution,
      growth: {
        customers: newCustomers,
        merchants: newMerchants,
        ngos: newNGOs,
        revenue: revenueGrowth
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ message: `User ${user.isVerified ? 'verified' : 'unverified'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify user' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update block status' });
  }
};

// --- PHASE 2 ---

export const getAllListings = async (req, res) => {
  try {
    const listings = await FoodListing.find().populate('merchant', 'name businessName email').sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

export const deleteListing = async (req, res) => {
  try {
    await FoodListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('merchant', 'name businessName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('merchant', 'name businessName')
      .populate('claimedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name email role').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    complaint.status = status;
    if (adminResponse) complaint.adminResponse = adminResponse;
    await complaint.save();
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve complaint' });
  }
};

export const createGlobalNotification = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  
  const users = await User.find({}).select('_id');
  if (users.length === 0) {
    return res.status(201).json({ message: 'No users to notify.' });
  }

  const notifications = users.map(u => ({
    recipient: u._id,
    type: 'System',
    title,
    message
  }));

  await Notification.insertMany(notifications);
  res.status(201).json({ message: `Notification sent to ${users.length} users.` });
});

export const getSettings = async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
