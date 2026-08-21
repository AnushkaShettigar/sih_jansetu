import express from 'express';
import {
  createDepartment,
  listDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import verifyJWT from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/', verifyJWT, authorize('admin'), createDepartment);
router.get('/', verifyJWT, listDepartments);
router.get('/:id', verifyJWT, getDepartmentById);
router.put('/:id', verifyJWT, authorize('admin'), updateDepartment);
router.delete('/:id', verifyJWT, authorize('admin'), deleteDepartment);

export default router;
