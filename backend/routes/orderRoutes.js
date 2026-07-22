import express from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getMerchantOrders
} from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, authorize('Customer'), createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/merchant').get(protect, authorize('Merchant', 'Admin'), getMerchantOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorize('Merchant', 'Admin'), updateOrderStatus);

export default router;
