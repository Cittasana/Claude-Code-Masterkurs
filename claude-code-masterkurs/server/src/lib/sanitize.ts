// ─────────────────────────────────────────────────────────────
// XSS-Schutz – Sanitization für Benutzereingaben
// ─────────────────────────────────────────────────────────────
// Entfernt potenziell gefährliche HTML-Tags und Attribute aus
// Freitext-Eingaben (Forum-Posts, Pattern-Beschreibungen, etc.)
// ─────────────────────────────────────────────────────────────

/**
 * Escapet HTML-Sonderzeichen, um XSS-Angriffe zu verhindern.
 * Wandelt <, >, &, ", ' in sichere HTML-Entities um.
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Entfernt HTML-Tags komplett aus einem String.
 * Erlaubt nur reinen Text.
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Entfernt gefährliche Patterns aus Benutzereingaben:
 * - HTML-Tags (komplett entfernt)
 * - JavaScript-URLs (javascript:, data:text/html, vbscript:)
 * - Event-Handler (onclick, onerror, etc.)
 * - Null-Bytes und unsichtbare Unicode-Zeichen
 */
export function sanitizeUserInput(input: string): string {
  let sanitized = input;

  // 1. Null-Bytes und unsichtbare Steuerzeichen entfernen (außer \n, \r, \t)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. HTML-Tags entfernen
  sanitized = stripHtml(sanitized);

  // 3. JavaScript-/VBScript-URLs entfernen
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, '');

  // 4. Event-Handler-Attribute entfernen (on*)
  sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');

  // 5. Expression/eval Patterns entfernen
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/eval\s*\(/gi, '');

  return sanitized.trim();
}

/**
 * Sanitiert ein Objekt rekursiv – alle string-Werte werden bereinigt.
 * Nützlich für Request-Bodies mit verschachtelten Feldern.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fieldsToSanitize?: string[]
): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      // Wenn fieldsToSanitize angegeben, nur diese Felder sanitizen
      if (!fieldsToSanitize || fieldsToSanitize.includes(key)) {
        (result as Record<string, unknown>)[key] = sanitizeUserInput(
          result[key] as string
        );
      }
    }
  }
  return result;
}
