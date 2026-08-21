import express from 'express';
import {
  createComplaint,
  listComplaints,
  getComplaintById,
  assignComplaint,
  updateStatus,
} from '../controllers/complaintController.js';
import verifyJWT from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/', verifyJWT, authorize('citizen'), createComplaint);
router.get('/', verifyJWT, listComplaints);
router.get('/:id', verifyJWT, getComplaintById);
router.put('/:id/assign', verifyJWT, authorize('admin'), assignComplaint);
router.put('/:id/status', verifyJWT, updateStatus);

export default router;
