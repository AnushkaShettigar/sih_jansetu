import express from 'express';
import {
  listNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../controllers/notificationController.js';
import verifyJWT from '../middleware/auth.js';

const router = express.Router();

// Static routes BEFORE parameterized routes so Express doesn't match
// "unread-count" or "read-all" as an :id parameter.
router.get('/unread-count', verifyJWT, getUnreadCount);
router.put('/read-all', verifyJWT, markAllAsRead);

router.get('/', verifyJWT, listNotifications);
router.put('/:id/read', verifyJWT, markAsRead);

export default router;
