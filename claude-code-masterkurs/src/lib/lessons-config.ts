// ─────────────────────────────────────────────────────────────
// Shared Lessons Config – Free Tier Constants (Frontend)
// ─────────────────────────────────────────────────────────────

/** Number of lessons accessible without any subscription (0-indexed IDs: 0..4) */
export const FREE_LESSON_LIMIT = 5;

/** Check if a lesson is in the free tier (client-side, for UI display) */
export function isFreeTierLesson(lessonId: number): boolean {
  return lessonId < FREE_LESSON_LIMIT;
}
