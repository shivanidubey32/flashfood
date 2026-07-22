import express from 'express';
import { getMyNotifications, markNotificationAsRead, markAllAsRead, deleteNotification, clearAllNotifications } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMyNotifications);
router.route('/read-all').put(protect, markAllAsRead);
router.route('/clear-all').delete(protect, clearAllNotifications);
router.route('/:id/read').put(protect, markNotificationAsRead);
router.route('/:id').delete(protect, deleteNotification);

export default router;
