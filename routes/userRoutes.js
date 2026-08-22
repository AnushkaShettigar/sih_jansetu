import express from 'express';
import { createAuthority, listUsers, getUserById } from '../controllers/userController.js';
import verifyJWT from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/authority', verifyJWT, authorize('admin'), createAuthority);
router.get('/', verifyJWT, authorize('admin'), listUsers);
router.get('/:id', verifyJWT, authorize('admin'), getUserById);

export default router;
