import Complaint from '../models/Complaint.js';
import { notifyEscalation } from './notificationService.js';

const ESCALATION_THRESHOLDS = [
  { level: 1, hoursStale: 12 },
  { level: 2, hoursStale: 24 },
  { level: 3, hoursStale: 48 },
  { level: 4, hoursStale: 72 },
  { level: 5, hoursStale: 96 },
];

/**
 * Run a single escalation check across all eligible complaints.
 *
 * Idempotent: a complaint is only escalated if its computed target level
 * is strictly greater than its current escalationLevel. Running this
 * function multiple times within the same threshold window is safe.
 *
 * Errors are caught per-complaint so one bad document cannot abort the
 * entire batch, and the outer try/catch ensures the scheduler never
 * crashes the Express server.
 */
export async function runEscalationCheck() {
  try {
    const complaints = await Complaint.find({
      status: { $in: ['assigned', 'in_progress'] },
      escalationLevel: { $lt: 5 },
    });

    const now = Date.now();

    for (const complaint of complaints) {
      try {
        // Pick the correct reference timestamp based on current status.
        let referenceDate = null;
        if (complaint.status === 'assigned') {
          referenceDate = complaint.assignedAt;
        } else if (complaint.status === 'in_progress') {
          referenceDate = complaint.inProgressAt;
        }

        // If the timestamp is missing (e.g. legacy data), skip.
        if (!referenceDate) continue;

        const hoursElapsed = (now - referenceDate.getTime()) / (1000 * 60 * 60);

        // Find the highest threshold that the elapsed time satisfies.
        let targetLevel = 0;
        for (const threshold of ESCALATION_THRESHOLDS) {
          if (hoursElapsed >= threshold.hoursStale) {
            targetLevel = threshold.level;
          }
        }

        // Idempotency guard: only escalate if the target is strictly higher.
        if (targetLevel <= complaint.escalationLevel) continue;

        const fromLevel = complaint.escalationLevel;

        complaint.escalationLevel = targetLevel;
        complaint.escalatedAt = new Date();
        complaint.escalationHistory.push({
          fromLevel,
          toLevel: targetLevel,
          escalatedAt: new Date(),
          reason: `Complaint stale for ${Math.floor(hoursElapsed)}+ hours in "${complaint.status}" status.`,
        });

        await complaint.save();

        // Notify admins + assigned authority.
        await notifyEscalation(complaint, fromLevel, targetLevel);
      } catch (err) {
        // Log and continue — don't let one complaint abort the batch.
        console.error(`Escalation error for complaint ${complaint._id}:`, err);
      }
    }
  } catch (err) {
    // Outer catch — ensures setInterval never crashes the process.
    console.error('Escalation scheduler error:', err);
  }
}

/**
 * Start the escalation scheduler.
 * Runs immediately on startup, then every 30 minutes.
 */
export function startEscalationScheduler() {
  // Initial run.
  runEscalationCheck();
  // Recurring runs every 30 minutes.
  setInterval(runEscalationCheck, 30 * 60 * 1000);
  console.log('Escalation scheduler started (every 30 minutes).');
}
