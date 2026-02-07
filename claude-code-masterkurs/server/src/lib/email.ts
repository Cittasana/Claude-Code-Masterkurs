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
