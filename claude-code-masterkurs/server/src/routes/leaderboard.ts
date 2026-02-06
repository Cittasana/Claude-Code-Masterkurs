import { Router } from 'express';
import { prisma, logger } from '../index.js';
import { optionalAuth } from '../middleware/auth.js';

export const leaderboardRouter = Router();

// ── GET /api/leaderboard ─────────────────────────────────────
// Returns the leaderboard with rankings

leaderboardRouter.get('/', optionalAuth, async (req, res) => {
  try {
    const sortBy = (req.query.sortBy as string) || 'points';
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));

    // Sorting is done in-memory after fetching (multiple fields)
    void sortBy; // used below in the sort function

    // Get all users with their progress
    const usersWithProgress = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        avatarEmoji: true,
        createdAt: true,
        progress: {
          select: {
            totalPoints: true,
            lessonsCompleted: true,
            streak: true,
            lastSessionDate: true,
          },
        },
        _count: {
          select: {
            quizResults: { where: { completed: true } },
            projectResults: { where: { completed: true } },
          },
        },
      },
    });

    // Map to leaderboard entries and sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = (usersWithProgress as any[])
      .filter((u) => u.progress) // Only users with progress
      .map((u) => {
        const lessonsCount = u.progress!.lessonsCompleted.length;
        return {
          id: u.id,
          displayName: u.displayName,
          avatarEmoji: u.avatarEmoji,
          totalPoints: u.progress!.totalPoints,
          lessonsCompleted: lessonsCount,
          quizzesCompleted: u._count.quizResults,
          projectsCompleted: u._count.projectResults,
          streak: u.progress!.streak,
          level: lessonsCount >= 12 ? 3 : lessonsCount >= 6 ? 2 : (1 as 1 | 2 | 3),
          joinedAt: u.createdAt.toISOString(),
          lastActiveAt: u.progress!.lastSessionDate.toISOString(),
          isCurrentUser: req.user ? u.id === req.user.userId : false,
        };
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'lessons':
            return b.lessonsCompleted - a.lessonsCompleted || b.totalPoints - a.totalPoints;
          case 'quizzes':
            return b.quizzesCompleted - a.quizzesCompleted || b.totalPoints - a.totalPoints;
          case 'streak':
            return b.streak - a.streak || b.totalPoints - a.totalPoints;
          default:
            return b.totalPoints - a.totalPoints;
        }
      })
      .slice(0, limit);

    res.json({ entries });
  } catch (error) {
    logger.error(error, 'Get leaderboard error');
    res.status(500).json({ error: 'Leaderboard konnte nicht geladen werden' });
  }
});
