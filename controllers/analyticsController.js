import Complaint from '../models/Complaint.js';

// GET /api/analytics/summary
// Auth: verifyJWT + authorize('admin')
// Returns total count, count per status, escalated count, and avg resolution time.
export async function getDashboardSummary(req, res) {
  try {
    const totalComplaints = await Complaint.countDocuments();

    // Count per status.
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const byStatus = {};
    for (const entry of statusCounts) {
      byStatus[entry._id] = entry.count;
    }

    // Count currently escalated.
    const escalatedCount = await Complaint.countDocuments({
      escalationLevel: { $gt: 0 },
      status: { $in: ['assigned', 'in_progress'] },
    });

    // Average resolution time (resolvedAt - createdAt) for resolved complaints only.
    const avgResult = await Complaint.aggregate([
      { $match: { resolvedAt: { $ne: null } } },
      {
        $group: {
          _id: null,
          avgResolutionMs: {
            $avg: { $subtract: ['$resolvedAt', '$createdAt'] },
          },
        },
      },
    ]);

    // Convert ms to hours, default to null if no resolved complaints exist.
    const avgResolutionHours =
      avgResult.length > 0 && avgResult[0].avgResolutionMs != null
        ? Math.round((avgResult[0].avgResolutionMs / (1000 * 60 * 60)) * 100) / 100
        : null;

    return res.status(200).json({
      totalComplaints,
      byStatus,
      escalatedCount,
      avgResolutionHours,
    });
  } catch (err) {
    console.error('getDashboardSummary error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching dashboard summary.' });
  }
}

// GET /api/analytics/by-department
// Auth: verifyJWT + authorize('admin')
export async function getComplaintsByDepartment(req, res) {
  try {
    const results = await Complaint.aggregate([
      { $match: { department: { $ne: null } } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgResolutionMs: {
            $avg: {
              $cond: [
                { $ne: ['$resolvedAt', null] },
                { $subtract: ['$resolvedAt', '$createdAt'] },
                null,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          departmentId: '$_id',
          departmentName: { $ifNull: ['$department.name', 'Unknown'] },
          count: 1,
          avgResolutionHours: {
            $cond: [
              { $ne: ['$avgResolutionMs', null] },
              { $round: [{ $divide: ['$avgResolutionMs', 3600000] }, 2] },
              null,
            ],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({ departments: results });
  } catch (err) {
    console.error('getComplaintsByDepartment error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching department analytics.' });
  }
}

// GET /api/analytics/by-category
// Auth: verifyJWT + authorize('admin')
export async function getComplaintsByCategory(req, res) {
  try {
    const results = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({ categories: results });
  } catch (err) {
    console.error('getComplaintsByCategory error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching category analytics.' });
  }
}

// GET /api/analytics/trend?period=daily|weekly|monthly
// Auth: verifyJWT + authorize('admin')
export async function getComplaintsTrend(req, res) {
  try {
    const period = req.query.period || 'daily';

    let dateFormat;
    switch (period) {
      case 'weekly':
        dateFormat = '%Y-W%V';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      case 'daily':
      default:
        dateFormat = '%Y-%m-%d';
        break;
    }

    const results = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: '$_id', count: 1 } },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json({ trend: results });
  } catch (err) {
    console.error('getComplaintsTrend error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching trend analytics.' });
  }
}

// GET /api/analytics/escalations
// Auth: verifyJWT + authorize('admin')
// Returns complaints currently escalated, grouped by escalation level.
export async function getEscalationReport(req, res) {
  try {
    const results = await Complaint.aggregate([
      {
        $match: {
          escalationLevel: { $gt: 0 },
          status: { $in: ['assigned', 'in_progress'] },
        },
      },
      {
        $group: {
          _id: '$escalationLevel',
          count: { $sum: 1 },
          complaints: {
            $push: {
              id: '$_id',
              title: '$title',
              status: '$status',
              escalatedAt: '$escalatedAt',
            },
          },
        },
      },
      { $project: { _id: 0, level: '$_id', count: 1, complaints: 1 } },
      { $sort: { level: 1 } },
    ]);

    return res.status(200).json({ escalations: results });
  } catch (err) {
    console.error('getEscalationReport error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching escalation report.' });
  }
}

// GET /api/analytics/top-authorities
// Auth: verifyJWT + authorize('admin')
// Top-performing authorities by resolution count and average resolution time.
export async function getTopAuthorities(req, res) {
  try {
    const results = await Complaint.aggregate([
      { $match: { resolvedAt: { $ne: null }, assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          resolvedCount: { $sum: 1 },
          avgResolutionMs: {
            $avg: { $subtract: ['$resolvedAt', '$createdAt'] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authority',
        },
      },
      { $unwind: { path: '$authority', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          authorityId: '$_id',
          name: { $ifNull: ['$authority.name', 'Unknown'] },
          email: { $ifNull: ['$authority.email', 'Unknown'] },
          resolvedCount: 1,
          avgResolutionHours: {
            $cond: [
              { $ne: ['$avgResolutionMs', null] },
              { $round: [{ $divide: ['$avgResolutionMs', 3600000] }, 2] },
              null,
            ],
          },
        },
      },
      { $sort: { resolvedCount: -1 } },
    ]);

    return res.status(200).json({ authorities: results });
  } catch (err) {
    console.error('getTopAuthorities error:', err);
    return res.status(500).json({ message: 'Something went wrong while fetching authority analytics.' });
  }
}
