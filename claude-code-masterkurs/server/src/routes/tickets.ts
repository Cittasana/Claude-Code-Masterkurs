import { Router } from 'express';
import { z } from 'zod';
import { prisma, logger } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { notifyNewSupportTicket } from '../lib/discord-webhooks.js';

export const ticketsRouter = Router();

// ── Validation ──────────────────────────────────────────────

const createTicketSchema = z.object({
  subject: z.string().min(3, 'Betreff zu kurz').max(200),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional().default('normal'),
});

const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});

// ── GET /api/tickets ────────────────────────────────────────
// List tickets for the current user (or all for admins)

ticketsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;

    // Check if admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isAdmin = user?.role === 'admin';

    const tickets = await prisma.supportTicket.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        user: { select: { id: true, displayName: true, email: true, avatarEmoji: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tickets });
  } catch (error) {
    logger.error(error, 'Get tickets error');
    res.status(500).json({ error: 'Tickets konnten nicht geladen werden' });
  }
});

// ── POST /api/tickets ───────────────────────────────────────
// Create a new support ticket

ticketsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const data = createTicketSchema.parse(req.body);
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true },
    });

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject,
        priority: data.priority,
      },
      include: {
        user: { select: { id: true, displayName: true, email: true, avatarEmoji: true } },
      },
    });

    // Send Discord webhook notification (non-blocking)
    notifyNewSupportTicket({
      subject: data.subject,
      userName: user?.displayName || 'Unbekannt',
      priority: data.priority,
    }).catch((err) => {
      logger.error({ error: err }, 'Failed to send support ticket Discord notification');
    });

    logger.info({ ticketId: ticket.id, userId }, 'Support ticket created');
    res.status(201).json({ ticket });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Create ticket error');
    res.status(500).json({ error: 'Ticket konnte nicht erstellt werden' });
  }
});

// ── PATCH /api/tickets/:id/status ───────────────────────────
// Update ticket status (admin only)

ticketsRouter.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const ticketId = String(req.params.id);

    // Check admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      res.status(403).json({ error: 'Nur Admins koennen den Status aendern' });
      return;
    }

    const data = updateStatusSchema.parse(req.body);

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status: data.status },
      include: {
        user: { select: { id: true, displayName: true, email: true, avatarEmoji: true } },
      },
    });

    logger.info({ ticketId, newStatus: data.status, adminId: userId }, 'Ticket status updated');
    res.json({ ticket });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    logger.error(error, 'Update ticket status error');
    res.status(500).json({ error: 'Ticket-Status konnte nicht aktualisiert werden' });
  }
});
