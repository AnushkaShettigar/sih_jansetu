import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

// GET /api/notifications
// Auth: verifyJWT
// Returns notifications for the authenticated user, sorted newest-first.
// Optional query param: ?unreadOnly=true
export async function listNotifications(req, res) {
  try {
    const filter = { recipient: req.user.id };

    if (req.query.unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ notifications });
  } catch (err) {
    console.error('listNotifications error:', err);
    return res.status(500).json({ message: 'Something went wrong while listing notifications.' });
  }
}

// GET /api/notifications/unread-count
// Auth: verifyJWT
export async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    return res.status(200).json({ count });
  } catch (err) {
    console.error('getUnreadCount error:', err);
    return res.status(500).json({ message: 'Something went wrong while counting notifications.' });
  }
}

// PUT /api/notifications/read-all
// Auth: verifyJWT
// Bulk-marks all of the authenticated user's notifications as read.
export async function markAllAsRead(req, res) {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('markAllAsRead error:', err);
    return res.status(500).json({ message: 'Something went wrong while marking notifications as read.' });
  }
}

// PUT /api/notifications/:id/read
// Auth: verifyJWT
// Marks a single notification as read. Only the recipient may do this.
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid notification ID.' });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    // Only the recipient can mark their own notification as read.
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to access this notification.' });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ notification });
  } catch (err) {
    console.error('markAsRead error:', err);
    return res.status(500).json({ message: 'Something went wrong while marking the notification as read.' });
  }
}
