import asyncHandler from '../middlewares/asyncHandler.js';
import Notification from '../models/Notification.js';

// @desc    Get logged in user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.recipient.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this notification');
    }
    notification.isRead = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );
  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    if (notification.recipient.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this notification');
    }
    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications/clear-all
// @access  Private
export const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });
  res.json({ message: 'All notifications cleared' });
});
