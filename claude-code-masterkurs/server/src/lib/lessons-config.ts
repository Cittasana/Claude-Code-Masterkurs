// ─────────────────────────────────────────────────────────────
// Lessons Access Configuration – Free Tier & Tier-based Access
// ─────────────────────────────────────────────────────────────

/** Number of lessons accessible without any subscription (0-indexed IDs: 0..4) */
export const FREE_LESSON_LIMIT = 5;

/** Total number of lessons in the course (updated dynamically via seed) */
export const TOTAL_LESSONS = 47;

/** Subscription tiers and their accessible lesson ranges */
export const LESSONS_CONFIG: Record<string, number[]> = {
  free: Array.from({ length: FREE_LESSON_LIMIT }, (_, i) => i), // [0, 1, 2, 3, 4]
  starter: Array.from({ length: TOTAL_LESSONS }, (_, i) => i),  // All lessons
  pro: Array.from({ length: TOTAL_LESSONS }, (_, i) => i),      // All lessons
  lifetime: Array.from({ length: TOTAL_LESSONS }, (_, i) => i), // All lessons
};

/** Subscription statuses that grant full (paid) access */
const ACTIVE_STATUSES = ['active', 'trialing', 'lifetime'];

export interface AccessCheckResult {
  canAccess: boolean;
  reason: 'free_lesson' | 'subscription_active' | 'requires_subscription';
  tier: string;
}

/**
 * Determines if a user can access a specific lesson.
 *
 * Rules:
 * 1. Lessons 0-4 (first 5) are free for everyone, including guests.
 * 2. Lessons 5+ require an active subscription (any paid tier) or lifetime access.
 *
 * @param lessonId - The 0-indexed lesson ID
 * @param subscription - The user's subscription data (null for guests)
 */
export function canAccessLesson(
  lessonId: number,
  subscription: { status: string; isLifetime: boolean } | null
): AccessCheckResult {
  // First 5 lessons are always free
  if (lessonId < FREE_LESSON_LIMIT) {
    return {
      canAccess: true,
      reason: 'free_lesson',
      tier: subscription ? getTierFromStatus(subscription) : 'free',
    };
  }

  // No subscription = no access beyond free lessons
  if (!subscription) {
    return {
      canAccess: false,
      reason: 'requires_subscription',
      tier: 'free',
    };
  }

  // Lifetime = always access
  if (subscription.isLifetime) {
    return {
      canAccess: true,
      reason: 'subscription_active',
      tier: 'lifetime',
    };
  }

  // Active subscription = access
  if (ACTIVE_STATUSES.includes(subscription.status)) {
    return {
      canAccess: true,
      reason: 'subscription_active',
      tier: 'pro',
    };
  }

  // Inactive / canceled / past_due = no access beyond free
  return {
    canAccess: false,
    reason: 'requires_subscription',
    tier: 'free',
  };
}

function getTierFromStatus(sub: { status: string; isLifetime: boolean }): string {
  if (sub.isLifetime) return 'lifetime';
  if (ACTIVE_STATUSES.includes(sub.status)) return 'pro';
  return 'free';
}
