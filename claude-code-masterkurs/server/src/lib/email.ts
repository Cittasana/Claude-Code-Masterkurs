import { Resend } from 'resend';
import { logger } from '../index.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@claude-code-masterkurs.de';
const APP_URL = process.env.APP_URL || 'https://claude-code-masterkurs.de';

// ── Send Password Reset Email ────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  displayName: string
): Promise<void> {
  const resetUrl = `${APP_URL}/password-reset/${resetToken}`;

  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – password reset email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Passwort zurücksetzen - Claude Code Masterkurs',
      html: getPasswordResetEmailHtml(resetUrl, displayName),
    });

    logger.info({ to }, 'Password reset email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send password reset email');
    throw new Error('E-Mail konnte nicht gesendet werden');
  }
}

// ── Send Email Verification Email ────────────────────────────────

export async function sendEmailVerificationEmail(
  to: string,
  verificationToken: string,
  displayName: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email/${verificationToken}`;

  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – verification email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'E-Mail bestätigen - Claude Code Masterkurs',
      html: getEmailVerificationHtml(verifyUrl, displayName),
    });

    logger.info({ to }, 'Email verification email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send email verification email');
    throw new Error('Verifizierungs-E-Mail konnte nicht gesendet werden');
  }
}

// ── Send Discord Invite Email ────────────────────────────────────

export async function sendDiscordInviteEmail(
  to: string,
  displayName: string,
  tier: string
): Promise<void> {
  const discordInviteLink = process.env.DISCORD_INVITE_LINK || 'https://discord.gg/claude-code-masterkurs';
  const connectDiscordUrl = `${APP_URL}/dashboard?discord=connect`;

  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – Discord invite email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Willkommen! Tritt unserer Discord-Community bei',
      html: getDiscordInviteEmailHtml(discordInviteLink, connectDiscordUrl, displayName, tier),
    });

    logger.info({ to, tier }, 'Discord invite email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send Discord invite email');
    // Non-blocking: do not throw, as this should not break the checkout flow
  }
}

// ── Send Free Signup Welcome Email ──────────────────────────────────

export async function sendFreeWelcomeEmail(
  to: string,
  displayName: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – free welcome email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Willkommen! Deine 5 kostenlosen Lektionen warten',
      html: getFreeWelcomeEmailHtml(displayName),
    });

    logger.info({ to }, 'Free welcome email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send free welcome email');
    // Non-blocking: do not throw
  }
}

// ── Drip Campaign Emails ────────────────────────────────────────────

export async function sendDripDay3Email(
  to: string,
  displayName: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – drip day 3 email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Pro-Tipp: So holst du das Meiste aus Claude Code',
      html: getDripDay3EmailHtml(displayName),
    });

    logger.info({ to }, 'Drip day 3 email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send drip day 3 email');
  }
}

export async function sendDripDay7Email(
  to: string,
  displayName: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – drip day 7 email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Exklusiv: 20% Rabatt auf den Claude Code Masterkurs',
      html: getDripDay7EmailHtml(displayName),
    });

    logger.info({ to }, 'Drip day 7 email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send drip day 7 email');
  }
}

// ── Send Newsletter Confirmation Email (Double-Opt-In) ───────

export async function sendNewsletterConfirmationEmail(
  to: string,
  confirmToken: string,
  displayName?: string
): Promise<void> {
  const confirmUrl = `${APP_URL}/newsletter/confirm/${confirmToken}`;

  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – newsletter confirmation email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Bitte bestätige deine Newsletter-Anmeldung',
      html: getNewsletterConfirmationHtml(confirmUrl, displayName),
    });

    logger.info({ to }, 'Newsletter confirmation email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send newsletter confirmation email');
    throw new Error('Bestätigungs-E-Mail konnte nicht gesendet werden');
  }
}

// ── Send Newsletter Welcome Email ────────────────────────────

export async function sendNewsletterWelcomeEmail(
  to: string,
  unsubscribeToken: string,
  displayName?: string
): Promise<void> {
  const unsubscribeUrl = `${APP_URL}/newsletter/unsubscribe/${unsubscribeToken}`;

  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – newsletter welcome email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Willkommen bei Claude Code Weekly Tips!',
      html: getNewsletterWelcomeHtml(unsubscribeUrl, displayName),
    });

    logger.info({ to }, 'Newsletter welcome email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send newsletter welcome email');
    // Non-blocking: do not throw
  }
}

// ── Send Newsletter Unsubscribe Confirmation Email ───────────

export async function sendNewsletterUnsubscribeEmail(
  to: string,
  displayName?: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, 'RESEND_API_KEY not set – newsletter unsubscribe email not sent');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Du wurdest vom Newsletter abgemeldet',
      html: getNewsletterUnsubscribeHtml(displayName),
    });

    logger.info({ to }, 'Newsletter unsubscribe confirmation email sent');
  } catch (error) {
    logger.error({ error, to }, 'Failed to send newsletter unsubscribe email');
    // Non-blocking: do not throw
  }
}

// ── HTML Templates ───────────────────────────────────────────────

function getPasswordResetEmailHtml(resetUrl: string, displayName: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🔐 Passwort zurücksetzen</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Du hast angefordert, dein Passwort zurückzusetzen. Klicke auf den Button unten, um ein neues Passwort zu erstellen:
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Passwort zurücksetzen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Oder kopiere diesen Link in deinen Browser:
              </p>
              <p style="margin: 0 0 20px; color: #667eea; font-size: 14px; word-break: break-all;">
                ${resetUrl}
              </p>

              <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⏰ Wichtig:</strong> Dieser Link ist nur <strong>1 Stunde</strong> gültig.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail einfach ignorieren. Dein Passwort bleibt dann unverändert.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Email Verification HTML Template ────────────────────────────

function getEmailVerificationHtml(verifyUrl: string, displayName: string): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail bestätigen</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">✉️ E-Mail bestätigen</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Willkommen beim <strong>Claude Code Masterkurs</strong>! 🎉 Bitte bestätige deine E-Mail-Adresse, um alle Funktionen nutzen zu können:
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      E-Mail bestätigen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Oder kopiere diesen Link in deinen Browser:
              </p>
              <p style="margin: 0 0 20px; color: #10b981; font-size: 14px; word-break: break-all;">
                ${verifyUrl}
              </p>

              <div style="margin: 30px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⏰ Wichtig:</strong> Dieser Link ist nur <strong>24 Stunden</strong> gültig.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Falls du dich nicht registriert hast, kannst du diese E-Mail einfach ignorieren.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #10b981; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Discord Invite Email HTML Template ──────────────────────────

function getDiscordInviteEmailHtml(
  discordInviteLink: string,
  connectDiscordUrl: string,
  displayName: string,
  tier: string
): string {
  const tierLabel: Record<string, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    lifetime: 'Lifetime',
  };

  const label = tierLabel[tier.toLowerCase()] || tier;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discord Community beitreten</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: #5865F2; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Willkommen in unserer Community!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Herzlichen Glueckwunsch zum <strong>${label}</strong>-Plan! Tritt jetzt unserer exklusiven Discord-Community bei:
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${discordInviteLink}" style="display: inline-block; padding: 14px 32px; background: #5865F2; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Discord beitreten
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 10px; color: #374151; font-size: 16px; line-height: 1.6;">
                <strong>Nach dem Beitritt:</strong>
              </p>
              <ol style="margin: 0 0 20px; color: #374151; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li>Verbinde Discord mit deinem Account: <a href="${connectDiscordUrl}" style="color: #5865F2;">Hier klicken</a></li>
                <li>Du erhaeltst automatisch die <strong>${label}</strong>-Rolle</li>
                <li>Zugang zu allen Channels deines Tiers</li>
              </ol>

              <div style="margin: 30px 0; padding: 16px; background-color: #eef2ff; border-left: 4px solid #5865F2; border-radius: 4px;">
                <p style="margin: 0; color: #3730a3; font-size: 14px; line-height: 1.6;">
                  <strong>Was dich erwartet:</strong> Austausch mit anderen Studenten, Code-Reviews, Projekt-Showcase, direkter Support und regelmaessige Office Hours.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #5865F2; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Free Welcome Email HTML Template ────────────────────────────────

function getFreeWelcomeEmailHtml(displayName: string): string {
  const lesson1Url = `${APP_URL}/lesson/0`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen beim Claude Code Masterkurs</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Willkommen beim Masterkurs!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Dein kostenloser Zugang zum Claude Code Masterkurs ist aktiviert! Du hast Zugriff auf <strong>5 komplette Lektionen</strong>, um Claude Code von Grund auf zu lernen.
              </p>

              <div style="margin: 30px 0; padding: 20px; background-color: #f0f4ff; border-radius: 8px;">
                <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px;">Deine kostenlosen Lektionen:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 2;">
                  <li>Was ist Claude Code?</li>
                  <li>Installation &amp; Setup</li>
                  <li>Authentifizierung &amp; Model-Auswahl</li>
                  <li>Erste Schritte &amp; Befehle</li>
                  <li>CLAUDE.md Mastery</li>
                </ol>
              </div>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${lesson1Url}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Jetzt mit Lektion 1 starten
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin: 30px 0; padding: 16px; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px;">
                <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                  <strong>Tipp:</strong> Nach den 5 kostenlosen Lektionen kannst du jederzeit upgraden und alle 27 Lektionen, Challenges und das Zertifikat freischalten.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">Claude Code Masterkurs</p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Drip Day 3 Email HTML Template ──────────────────────────────────

function getDripDay3EmailHtml(displayName: string): string {
  const dashboardUrl = `${APP_URL}/dashboard`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pro-Tipp fuer Claude Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Pro-Tipp: CLAUDE.md</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Wusstest du, dass die meisten Claude Code Profis eine <strong>CLAUDE.md</strong>-Datei nutzen? Damit gibst du Claude dauerhaften Kontext ueber dein Projekt.
              </p>

              <div style="margin: 20px 0; padding: 16px; background-color: #1e1e1e; border-radius: 8px; font-family: monospace; color: #d4d4d4; font-size: 14px; line-height: 1.8;">
                <span style="color: #569cd6;"># CLAUDE.md</span><br>
                <span style="color: #6a9955;">## Projekt</span><br>
                <span style="color: #d4d4d4;">E-Commerce App mit React + Node.js</span><br><br>
                <span style="color: #6a9955;">## Regeln</span><br>
                <span style="color: #d4d4d4;">- TypeScript strict mode</span><br>
                <span style="color: #d4d4d4;">- Tests mit Vitest</span><br>
                <span style="color: #d4d4d4;">- Commits auf Deutsch</span>
              </div>

              <p style="margin: 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Das lernst du in <strong>Lektion 5: CLAUDE.md Mastery</strong> – eine der beliebtesten kostenlosen Lektionen!
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Weiterlernen
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Drip Day 7 Email HTML Template (20% Rabatt) ─────────────────────

function getDripDay7EmailHtml(displayName: string): string {
  const pricingUrl = `${APP_URL}/register`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>20% Rabatt fuer dich</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">20% Rabatt - nur fuer dich!</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Hallo <strong>${displayName}</strong>,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Du hast die kostenlosen Lektionen gestartet - super! Jetzt wird es Zeit fuer den naechsten Schritt. Als Dankeschoen bekommst du <strong>20% Rabatt</strong> auf den gesamten Kurs.
              </p>

              <div style="margin: 30px 0; padding: 24px; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px dashed #10b981; border-radius: 12px; text-align: center;">
                <p style="margin: 0 0 8px; color: #065f46; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Dein Rabattcode</p>
                <p style="margin: 0; color: #059669; font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: 4px;">FREESTARTER20</p>
                <p style="margin: 8px 0 0; color: #065f46; font-size: 14px;">20% auf alle Abo-Modelle</p>
              </div>

              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #374151; font-size: 16px;">Was du mit dem Upgrade bekommst:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Alle 27 Lektionen (statt nur 5)</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Praxis-Projekte &amp; Live-Challenges</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Offizielles Zertifikat</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Discord-Community Zugang</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Spaced Repetition System</td></tr>
                </table>
              </div>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${pricingUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Jetzt 20% sparen
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin: 20px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Hinweis:</strong> Der Code <strong>FREESTARTER20</strong> ist 30 Tage gueltig.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Newsletter Confirmation Email HTML Template ─────────────────

function getNewsletterConfirmationHtml(confirmUrl: string, displayName?: string): string {
  const greeting = displayName ? `Hallo <strong>${displayName}</strong>` : 'Hallo';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter-Anmeldung bestaetigen</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Claude Code Weekly Tips</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 16px;">Newsletter-Anmeldung bestaetigen</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                ${greeting},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Vielen Dank fuer dein Interesse an <strong>Claude Code Weekly Tips</strong>! Bitte bestaetige deine Anmeldung mit einem Klick:
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Anmeldung bestaetigen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Oder kopiere diesen Link in deinen Browser:
              </p>
              <p style="margin: 0 0 20px; color: #667eea; font-size: 14px; word-break: break-all;">
                ${confirmUrl}
              </p>

              <div style="margin: 30px 0; padding: 16px; background-color: #f0f4ff; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0; color: #3730a3; font-size: 14px; line-height: 1.6;">
                  <strong>Was dich erwartet:</strong> Woechentliche Tipps, Tricks und Best Practices rund um Claude Code – direkt in dein Postfach.
                </p>
              </div>

              <p style="margin: 20px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Falls du dich nicht angemeldet hast, kannst du diese E-Mail einfach ignorieren.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Newsletter Welcome Email HTML Template ──────────────────────

function getNewsletterWelcomeHtml(unsubscribeUrl: string, displayName?: string): string {
  const greeting = displayName ? `Hallo <strong>${displayName}</strong>` : 'Hallo';
  const freeStartUrl = `${APP_URL}/start-kostenlos`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen bei Claude Code Weekly Tips!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Willkommen an Bord!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                ${greeting},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Deine Anmeldung fuer <strong>Claude Code Weekly Tips</strong> ist bestaetigt! Ab jetzt erhaeltst du regelmaessig:
              </p>

              <div style="margin: 20px 0; padding: 20px; background-color: #f0fdf4; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Woechentliche Claude Code Tipps &amp; Tricks</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Best Practices fuer Prompts &amp; Workflows</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Neue Features &amp; Updates erklaert</td></tr>
                  <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;">&#10003; Exklusive Rabatte &amp; Early Access</td></tr>
                </table>
              </div>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${freeStartUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      5 kostenlose Lektionen starten
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #10b981; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Newsletter abmelden</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Newsletter Unsubscribe Confirmation HTML Template ────────────

function getNewsletterUnsubscribeHtml(displayName?: string): string {
  const greeting = displayName ? `Hallo <strong>${displayName}</strong>` : 'Hallo';
  const resubscribeUrl = `${APP_URL}/newsletter`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter abgemeldet</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">Schade, dich zu verlieren!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                ${greeting},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Du wurdest erfolgreich vom <strong>Claude Code Weekly Tips</strong> Newsletter abgemeldet. Du erhaeltst keine weiteren E-Mails von uns.
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Falls du es dir anders ueberlegst, kannst du dich jederzeit erneut anmelden:
              </p>

              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resubscribeUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Erneut anmelden
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #9ca3af; font-size: 13px;">
                Claude Code Masterkurs
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="${APP_URL}" style="color: #667eea; text-decoration: none;">claude-code-masterkurs.de</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
