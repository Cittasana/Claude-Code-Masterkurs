import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../index.js';

// ── Admin Middleware ─────────────────────────────────────────────
// Requires requireAuth to run first (sets req.user).
// Checks that the authenticated user has role === 'admin'.

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Nicht authentifiziert' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'admin') {
      res.status(403).json({ error: 'Keine Admin-Berechtigung' });
      return;
    }

    next();
  } catch {
    res.status(500).json({ error: 'Interner Server-Fehler' });
  }
}
