import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Notify reporter and assigned authority (if any) of a status change.
 * Called by updateStatus, assignComplaint, and reopenComplaint.
 *
 * @param {object}   complaint      - The complaint document (after status change)
 * @param {string}   prevStatus     - Status before the change
 * @param {string}   newStatus      - Status after the change
 * @param {string}   changedByUserId - The user who triggered the change
 */
export async function notifyStatusChange(complaint, prevStatus, newStatus, changedByUserId) {
  const recipients = new Set();

  // Always notify the citizen who reported the complaint.
  if (complaint.reportedBy) {
    recipients.add(complaint.reportedBy.toString());
  }

  // Notify the assigned authority, if any.
  if (complaint.assignedTo) {
    recipients.add(complaint.assignedTo.toString());
  }

  // Don't notify the person who performed the action — they already know.
  recipients.delete(changedByUserId);

  const notifications = [];
  for (const recipientId of recipients) {
    notifications.push({
      recipient: recipientId,
      type: 'status_change',
      title: 'Complaint Status Updated',
      message: `Complaint "${complaint.title}" status changed from "${prevStatus}" to "${newStatus}".`,
      complaint: complaint._id,
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}

/**
 * Notify the authority that a complaint has been assigned to them.
 * This is a separate notification from the status-change notification to
 * avoid accidental duplicates — assignment is called out distinctly.
 *
 * @param {object} complaint       - The complaint document (after assignment)
 * @param {string} authorityUserId - The authority user ID being assigned
 */
export async function notifyAssignment(complaint, authorityUserId) {
  await Notification.create({
    recipient: authorityUserId,
    type: 'assignment',
    title: 'New Complaint Assigned',
    message: `You have been assigned complaint "${complaint.title}".`,
    complaint: complaint._id,
  });
}

/**
 * Notify all admins and the assigned authority when a complaint escalates.
 *
 * @param {object} complaint - The complaint document (after escalation)
 * @param {number} fromLevel - Previous escalation level
 * @param {number} toLevel   - New escalation level
 */
export async function notifyEscalation(complaint, fromLevel, toLevel) {
  const recipients = new Set();

  // All admin users.
  const admins = await User.find({ role: 'admin' }).select('_id');
  for (const admin of admins) {
    recipients.add(admin._id.toString());
  }

  // The assigned authority.
  if (complaint.assignedTo) {
    recipients.add(complaint.assignedTo.toString());
  }

  const notifications = [];
  for (const recipientId of recipients) {
    notifications.push({
      recipient: recipientId,
      type: 'escalation',
      title: 'Complaint Escalated',
      message: `Complaint "${complaint.title}" escalated from level ${fromLevel} to level ${toLevel}.`,
      complaint: complaint._id,
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}

/**
 * Notify the assigned authority that the citizen has verified resolution.
 *
 * @param {object} complaint - The complaint document
 * @param {number} rating    - Satisfaction rating (1–5)
 */
export async function notifyResolutionVerified(complaint, rating) {
  if (!complaint.assignedTo) return;

  await Notification.create({
    recipient: complaint.assignedTo,
    type: 'resolution_verified',
    title: 'Resolution Verified by Citizen',
    message: `The citizen verified the resolution of "${complaint.title}" with a satisfaction rating of ${rating}/5.`,
    complaint: complaint._id,
  });
}

/**
 * Notify all admins and the previously assigned authority that a complaint
 * has been reopened.
 *
 * @param {object} complaint - The complaint document (after reopening)
 * @param {string} reason    - The reopen reason
 */
export async function notifyComplaintReopened(complaint, reason) {
  const recipients = new Set();

  // All admin users.
  const admins = await User.find({ role: 'admin' }).select('_id');
  for (const admin of admins) {
    recipients.add(admin._id.toString());
  }

  // The assigned authority (still set on the complaint at this point).
  if (complaint.assignedTo) {
    recipients.add(complaint.assignedTo.toString());
  }

  const notifications = [];
  for (const recipientId of recipients) {
    notifications.push({
      recipient: recipientId,
      type: 'complaint_reopened',
      title: 'Complaint Reopened',
      message: `Complaint "${complaint.title}" has been reopened. Reason: ${reason}`,
      complaint: complaint._id,
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}
