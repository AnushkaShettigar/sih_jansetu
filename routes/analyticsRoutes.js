import express from 'express';
import {
  getDashboardSummary,
  getComplaintsByDepartment,
  getComplaintsByCategory,
  getComplaintsTrend,
  getEscalationReport,
  getTopAuthorities,
} from '../controllers/analyticsController.js';
import verifyJWT from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.get('/summary', verifyJWT, authorize('admin'), getDashboardSummary);
router.get('/by-department', verifyJWT, authorize('admin'), getComplaintsByDepartment);
router.get('/by-category', verifyJWT, authorize('admin'), getComplaintsByCategory);
router.get('/trend', verifyJWT, authorize('admin'), getComplaintsTrend);
router.get('/escalations', verifyJWT, authorize('admin'), getEscalationReport);
router.get('/top-authorities', verifyJWT, authorize('admin'), getTopAuthorities);

export default router;
