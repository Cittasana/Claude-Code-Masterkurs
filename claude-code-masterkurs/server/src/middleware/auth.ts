import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

// ── Types ────────────────────────────────────────────────────

export interface JWTPayload {
  userId: string;
  email: string;
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// ── JWT Helpers ──────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

// ── Auth Middleware ───────────────────────────────────────────
// Verifies the JWT token from the Authorization header.
// Sets req.user if valid, responds with 401 if not.

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Kein Token vorhanden' });
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Benutzer nicht gefunden' });
      return;
    }

    req.user = { userId: user.id, email: user.email };
    next();
  } catch {
    res.status(401).json({ error: 'Ungültiger oder abgelaufener Token' });
  }
}

// ── Optional Auth Middleware ──────────────────────────────────
// Sets req.user if a valid token is present, but does NOT block.
// Useful for endpoints that work for both guests and logged-in users.

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      req.user = payload;
    }
  } catch {
    // Token invalid – proceed as guest
  }
  next();
}
