import express from 'express';
import { 
  getAdminStats, getUsers, verifyUser, blockUser,
  getAllListings, deleteListing,
  getAllOrders, updateOrderStatus,
  getAllDonations,
  getAllComplaints, resolveComplaint,
  createGlobalNotification,
  getSettings, updateSettings
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

// Phase 1
router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/verify/:id', verifyUser);
router.put('/block/:id', blockUser);

// Phase 2
router.get('/listings', getAllListings);
router.delete('/listings/:id', deleteListing);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/donations', getAllDonations); // Pickups

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/resolve', resolveComplaint);

router.post('/notifications', createGlobalNotification);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
