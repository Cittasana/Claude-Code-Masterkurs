#!/usr/bin/env tsx
/**
 * Script zum Erstellen von Promo-Codes
 * 
 * Usage:
 *   tsx scripts/create-promo-code.ts CODE123 --months 6 --max-uses 100 --description "Willkommensangebot"
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
📝 Promo Code Generator

Usage:
  tsx scripts/create-promo-code.ts <CODE> [options]

Options:
  --months <number>        Anzahl der Gratis-Monate (default: 6)
  --max-uses <number>      Max. Anzahl Verwendungen (default: unlimited)
  --description <text>     Beschreibung des Codes
  --expires <date>         Ablaufdatum (ISO format, z.B. 2024-12-31)

Examples:
  tsx scripts/create-promo-code.ts WELCOME2024
  tsx scripts/create-promo-code.ts EARLYBIRD --months 12 --max-uses 50
  tsx scripts/create-promo-code.ts SUMMER2024 --months 6 --max-uses 100 --description "Sommeraktion"
  tsx scripts/create-promo-code.ts BLACKFRIDAY --months 6 --expires 2024-12-01
    `);
    process.exit(0);
  }

  const code = args[0].toUpperCase();
  
  // Parse arguments
  const months = parseInt(args[args.indexOf('--months') + 1] || '6');
  const maxUsesIndex = args.indexOf('--max-uses');
  const maxUses = maxUsesIndex > -1 ? parseInt(args[maxUsesIndex + 1]) : null;
  const descriptionIndex = args.indexOf('--description');
  const description = descriptionIndex > -1 ? args[descriptionIndex + 1] : null;
  const expiresIndex = args.indexOf('--expires');
  const expiresAt = expiresIndex > -1 ? new Date(args[expiresIndex + 1]) : null;

  // Validierung
  if (code.length < 3) {
    console.error('❌ Code muss mindestens 3 Zeichen haben');
    process.exit(1);
  }

  if (isNaN(months) || months < 1 || months > 12) {
    console.error('❌ Monate müssen zwischen 1 und 12 liegen');
    process.exit(1);
  }

  if (maxUses !== null && (isNaN(maxUses) || maxUses < 1)) {
    console.error('❌ Max-Uses muss eine positive Zahl sein');
    process.exit(1);
  }

  // Prüfen ob Code bereits existiert
  const existing = await prisma.promoCode.findUnique({
    where: { code },
  });

  if (existing) {
    console.error(`❌ Code "${code}" existiert bereits`);
    process.exit(1);
  }

  // Promo Code erstellen
  const promoCode = await prisma.promoCode.create({
    data: {
      code,
      durationMonths: months,
      maxUses,
      description,
      expiresAt,
      active: true,
    },
  });

  console.log('\n✅ Promo Code erfolgreich erstellt!\n');
  console.log(`📋 Details:`);
  console.log(`   Code:         ${promoCode.code}`);
  console.log(`   Monate:       ${promoCode.durationMonths}`);
  console.log(`   Max. Uses:    ${promoCode.maxUses || 'Unbegrenzt'}`);
  console.log(`   Beschreibung: ${promoCode.description || '-'}`);
  console.log(`   Läuft ab:     ${promoCode.expiresAt ? promoCode.expiresAt.toLocaleDateString() : 'Nie'}`);
  console.log(`   Aktiv:        ${promoCode.active ? 'Ja' : 'Nein'}`);
  console.log();
}

main()
  .catch((error) => {
    console.error('❌ Fehler:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
