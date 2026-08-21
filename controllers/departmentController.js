import mongoose from 'mongoose';
import Department from '../models/Department.js';

function toPublicDepartment(dept) {
  return {
    id: dept._id,
    name: dept.name,
    description: dept.description,
    createdAt: dept.createdAt,
  };
}

// POST /api/departments
// Auth: verifyJWT + authorize('admin')
export async function createDepartment(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    const trimmedName = name.trim();

    const existing = await Department.findOne({ name: trimmedName });
    if (existing) {
      return res.status(409).json({ message: 'A department with this name already exists.' });
    }

    const department = await Department.create({
      name: trimmedName,
      description: typeof description === 'string' ? description.trim() : '',
    });

    return res.status(201).json({ department: toPublicDepartment(department) });
  } catch (err) {
    console.error('createDepartment error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the department.' });
  }
}

// GET /api/departments
// Auth: verifyJWT
export async function listDepartments(req, res) {
  try {
    const departments = await Department.find();
    return res.status(200).json({
      departments: departments.map(toPublicDepartment),
    });
  } catch (err) {
    console.error('listDepartments error:', err);
    return res.status(500).json({ message: 'Something went wrong while listing departments.' });
  }
}

// GET /api/departments/:id
// Auth: verifyJWT
export async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid department ID.' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    return res.status(200).json({ department: toPublicDepartment(department) });
  } catch (err) {
    console.error('getDepartmentById error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching the department.' });
  }
}

// PUT /api/departments/:id
// Auth: verifyJWT + authorize('admin')
export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid department ID.' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Department name cannot be empty.' });
      }
      const trimmedName = name.trim();

      const existing = await Department.findOne({ name: trimmedName, _id: { $ne: id } });
      if (existing) {
        return res.status(409).json({ message: 'A department with this name already exists.' });
      }
      department.name = trimmedName;
    }

    if (description !== undefined) {
      department.description = typeof description === 'string' ? description.trim() : '';
    }

    await department.save();

    return res.status(200).json({ department: toPublicDepartment(department) });
  } catch (err) {
    console.error('updateDepartment error:', err);
    return res.status(500).json({ message: 'Something went wrong while updating the department.' });
  }
}

// DELETE /api/departments/:id
// Auth: verifyJWT + authorize('admin')
export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid department ID.' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await department.deleteOne();

    return res.status(200).json({ message: 'Department deleted.' });
  } catch (err) {
    console.error('deleteDepartment error:', err);
    return res.status(500).json({ message: 'Something went wrong while deleting the department.' });
  }
}
