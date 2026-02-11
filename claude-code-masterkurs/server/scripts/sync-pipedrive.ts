#!/usr/bin/env tsx
/**
 * Script zum Synchronisieren aller bestehenden Kunden nach Pipedrive
 * 
 * Usage (aus dem server/ Verzeichnis):
 *   npx tsx --env-file .env scripts/sync-pipedrive.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN || '';
const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN || '';

function getBaseUrl(): string {
  return `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1`;
}

// ── Pipedrive API-Helfer ─────────────────────────────────────

async function findPersonByEmail(email: string): Promise<any | null> {
  const url = `${getBaseUrl()}/persons/search?api_token=${PIPEDRIVE_API_TOKEN}&term=${encodeURIComponent(email)}&fields=email&limit=1`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) return null;
  const json = await response.json() as any;
  if (!json.success || !json.data?.items?.length) return null;
  return json.data.items[0].item;
}

async function createPerson(name: string, email: string): Promise<any> {
  const url = `${getBaseUrl()}/persons?api_token=${PIPEDRIVE_API_TOKEN}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email: [email] }),
  });
  const json = await response.json() as any;
  if (!json.success) throw new Error(`Person anlegen fehlgeschlagen: ${json.error}`);
  return json.data;
}

async function createDeal(title: string, personId: number, value?: number): Promise<any> {
  const url = `${getBaseUrl()}/deals?api_token=${PIPEDRIVE_API_TOKEN}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      person_id: personId,
      value,
      currency: 'EUR',
      status: 'won',
    }),
  });
  const json = await response.json() as any;
  if (!json.success) throw new Error(`Deal anlegen fehlgeschlagen: ${json.error}`);
  return json.data;
}

// ── Hauptfunktion ────────────────────────────────────────────

async function main() {
  // Konfiguration prüfen
  if (!PIPEDRIVE_API_TOKEN || !PIPEDRIVE_DOMAIN) {
    console.error('❌ PIPEDRIVE_API_TOKEN und PIPEDRIVE_DOMAIN müssen in der .env gesetzt sein!');
    process.exit(1);
  }

  console.log(`\n🔄 Pipedrive-Sync gestartet (${PIPEDRIVE_DOMAIN}.pipedrive.com)\n`);

  // Alle User mit aktiver Subscription oder Lifetime holen
  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ['active', 'trialing', 'lifetime'] },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
    },
  });

  if (subscriptions.length === 0) {
    console.log('ℹ️  Keine aktiven Kunden gefunden.');
    return;
  }

  console.log(`📋 ${subscriptions.length} aktive Kunden gefunden\n`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const sub of subscriptions) {
    const { user } = sub;
    const email = user.email;
    const name = user.displayName || email;

    try {
      // 1. Person suchen oder anlegen
      let person = await findPersonByEmail(email);

      if (person) {
        console.log(`  ⏭️  ${email} – Person existiert bereits (ID: ${person.id})`);
        skipCount++;
      } else {
        person = await createPerson(name, email);
        console.log(`  ✅ ${email} – Person angelegt (ID: ${person.id})`);
      }

      // 2. Deal anlegen
      const dealTitle = sub.isLifetime
        ? 'Claude Code Masterkurs – Lifetime'
        : 'Claude Code Masterkurs – Abo';

      const deal = await createDeal(dealTitle, person.id);
      console.log(`  ✅ ${email} – Deal angelegt: "${dealTitle}" (ID: ${deal.id})`);

      successCount++;

      // Kurze Pause, um Rate Limits zu vermeiden
      await new Promise((r) => setTimeout(r, 300));
    } catch (error: any) {
      console.error(`  ❌ ${email} – Fehler: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`✅ Erfolgreich: ${successCount}`);
  console.log(`⏭️  Übersprungen: ${skipCount}`);
  console.log(`❌ Fehler: ${errorCount}`);
  console.log(`📊 Gesamt: ${subscriptions.length}\n`);
}

main()
  .catch((error) => {
    console.error('❌ Fehler:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
