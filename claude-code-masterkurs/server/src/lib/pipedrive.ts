// ── Pipedrive CRM Integration ────────────────────────────────
// Erstellt automatisch Kontakte und Deals in Pipedrive
// wenn ein Kunde ein Abo abschließt.
// ─────────────────────────────────────────────────────────────

import { logger } from '../index.js';

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN || '';
const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN || ''; // z.B. "firmenname" → firmenname.pipedrive.com

function getBaseUrl(): string {
  return `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1`;
}

function isConfigured(): boolean {
  return !!(PIPEDRIVE_API_TOKEN && PIPEDRIVE_DOMAIN);
}

// ── Typen ────────────────────────────────────────────────────

interface PipedrivePersonResult {
  id: number;
  name: string;
  email: string[];
}

interface PipedriveDealResult {
  id: number;
  title: string;
}

// ── API-Helfer ───────────────────────────────────────────────

async function pipedriveFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${endpoint}?api_token=${PIPEDRIVE_API_TOKEN}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Pipedrive API Fehler (${response.status}): ${errorBody}`
    );
  }

  const json = (await response.json()) as { success: boolean; data: T; error?: string };

  if (!json.success) {
    throw new Error(`Pipedrive Fehler: ${json.error || 'Unbekannter Fehler'}`);
  }

  return json.data;
}

// ── Person suchen (nach E-Mail) ──────────────────────────────

async function findPersonByEmail(email: string): Promise<PipedrivePersonResult | null> {
  const url = `${getBaseUrl()}/persons/search?api_token=${PIPEDRIVE_API_TOKEN}&term=${encodeURIComponent(email)}&fields=email&limit=1`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    success: boolean;
    data: { items: Array<{ item: PipedrivePersonResult }> } | null;
  };

  if (!json.success || !json.data?.items?.length) {
    return null;
  }

  return json.data.items[0].item;
}

// ── Person anlegen ───────────────────────────────────────────

async function createPerson(data: {
  name: string;
  email: string;
}): Promise<PipedrivePersonResult> {
  return pipedriveFetch<PipedrivePersonResult>('/persons', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      email: [data.email],
    }),
  });
}

// ── Deal anlegen ─────────────────────────────────────────────

async function createDeal(data: {
  title: string;
  personId: number;
  value?: number;
  currency?: string;
  status?: 'open' | 'won' | 'lost' | 'deleted';
}): Promise<PipedriveDealResult> {
  return pipedriveFetch<PipedriveDealResult>('/deals', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      person_id: data.personId,
      value: data.value,
      currency: data.currency || 'EUR',
      status: data.status || 'won',
    }),
  });
}

// ── Hauptfunktion: Neuen Kunden in Pipedrive anlegen ─────────
// Wird vom Stripe-Webhook aufgerufen nach erfolgreichem Checkout

export async function createPipedriveContact(params: {
  email: string;
  displayName: string;
  isLifetime: boolean;
  amountPaid?: number; // in Cent (von Stripe)
}): Promise<void> {
  if (!isConfigured()) {
    logger.warn('Pipedrive nicht konfiguriert – Kontakt wird nicht angelegt. Bitte PIPEDRIVE_API_TOKEN und PIPEDRIVE_DOMAIN setzen.');
    return;
  }

  try {
    // 1. Prüfen ob Person bereits existiert
    let person = await findPersonByEmail(params.email);

    // 2. Person anlegen falls nicht vorhanden
    if (!person) {
      person = await createPerson({
        name: params.displayName || params.email,
        email: params.email,
      });
      logger.info(
        { personId: person.id, email: params.email },
        'Pipedrive: Neue Person angelegt'
      );
    } else {
      logger.info(
        { personId: person.id, email: params.email },
        'Pipedrive: Bestehende Person gefunden'
      );
    }

    // 3. Deal anlegen (als "gewonnen" markiert)
    const dealTitle = params.isLifetime
      ? 'Claude Code Masterkurs – Lifetime'
      : 'Claude Code Masterkurs – Abo';

    const amountInEuro = params.amountPaid
      ? params.amountPaid / 100 // Stripe liefert Cent
      : undefined;

    const deal = await createDeal({
      title: dealTitle,
      personId: person.id,
      value: amountInEuro,
      currency: 'EUR',
      status: 'won',
    });

    logger.info(
      {
        dealId: deal.id,
        personId: person.id,
        email: params.email,
        isLifetime: params.isLifetime,
      },
      'Pipedrive: Deal erfolgreich angelegt'
    );
  } catch (error) {
    // Pipedrive-Fehler sollen den Webhook NICHT zum Scheitern bringen
    // Der Stripe-Checkout ist wichtiger als das CRM-Update
    logger.error(
      { error, email: params.email },
      'Pipedrive: Fehler beim Anlegen des Kontakts/Deals'
    );
  }
}
