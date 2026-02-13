# 39. MCP Server: PostgreSQL

**Kategorie**: Database MCP Server
**Schwierigkeit**: Fortgeschritten
**Installation**: `npx @modelcontextprotocol/create-server postgres`
**Offizielle Docs**: [MCP PostgreSQL Server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)

---

> 🚀 **Claude Code Relevanz**: Der PostgreSQL MCP Server gibt Claude Code direkten Datenbank-Zugriff, sodass Schema-Analysen, Query-Optimierung und Migrationen direkt aus der Entwicklungsumgebung heraus moeglich werden.

## 🎯 Was ist der PostgreSQL MCP Server?

Der **PostgreSQL MCP Server** gibt Claude Code direkten Zugriff auf deine PostgreSQL Datenbanken. Claude kann Queries ausführen, Schema analysieren, Daten einfügen/updaten und Migrationen durchführen - alles strukturiert über MCP Tools.

### Warum PostgreSQL via MCP?

**Ohne MCP**:

Ohne den PostgreSQL MCP Server muss Claude SQL-Queries als Shell-Befehle ueber `psql` ausfuehren und den Text-Output parsen. Das ist fehleranfaellig, weil das Ausgabeformat von der psql-Konfiguration abhaengt und sich bei verschiedenen PostgreSQL-Versionen unterscheiden kann. Ausserdem erhaelt Claude keine typisierten Daten -- alles kommt als String zurueck, und Claude muss raten, ob eine Spalte ein Integer, ein Datum oder ein Text ist. Bei grossen Ergebnismengen wird der Text-Output unleserlich, und bei Fehlern erhaelt Claude nur eine kryptische Fehlermeldung. Der MCP-Ansatz loest all diese Probleme.

```bash
# Claude generiert SQL + Shell-Command
psql -U user -d mydb -c "SELECT * FROM users WHERE id = 1"
→ Parse Text-Output ist fehleranfällig
```

**Mit MCP**:

Mit dem PostgreSQL MCP Server fuehrt Claude SQL-Queries direkt ueber die MCP-Schnittstelle aus und erhaelt eine strukturierte JSON-Response zurueck. Die Response enthaelt nicht nur die Ergebnis-Rows als JSON-Objekte, sondern auch Metadaten wie die Feldnamen, Datentypen und die Anzahl der betroffenen Zeilen. Claude kann diese Daten sofort weiterverarbeiten, ohne Text-Parsing betreiben zu muessen. Stell dir vor, Claude fragt die Users-Tabelle ab -- es erhaelt ein sauberes Array von Objekten mit typisierten Werten, die es direkt analysieren und praesentieren kann. Die strukturierte Fehlerbehandlung liefert bei Problemen klare, maschinenlesbare Fehlermeldungen statt kryptischer psql-Ausgaben.

```json
{
  "method": "postgres_query",
  "params": {
    "query": "SELECT * FROM users WHERE id = 1"
  }
}
→ Strukturierte JSON-Response mit Rows & Metadata
```

---

## 🔧 Berechtigung

### Warum brauchst du den PostgreSQL MCP Server?

1. **Structured Queries**: JSON statt Text-Parsing
2. **Safety Checks**: Verhindert destructive Operations (DROP, TRUNCATE ohne Confirm)
3. **Schema Introspection**: Claude versteht deine DB-Struktur
4. **Migration Help**: Claude erstellt/applied Migrations
5. **Query Optimization**: Claude analysiert EXPLAIN Plans

### Use Cases

- **Schema Analysis**: Claude analysiert Tables, Columns, Indexes
- **Data Exploration**: Claude queried & visualisiert Daten
- **Migration Generation**: Claude erstellt Migrations aus Natural Language
- **Query Optimization**: Claude optimiert langsame Queries
- **Seed Data**: Claude generiert Test-Daten

---

## 💻 Verwendung

Von der Installation bis zu den verfuegbaren MCP Tools -- dieser Abschnitt zeigt dir die komplette Einrichtung des PostgreSQL MCP Servers.

### Installation & Setup

Der folgende Befehl installiert den PostgreSQL MCP Server global auf deinem System. Der Connection String folgt dem standardisierten Format `postgresql://user:password@host:port/database`, das von allen PostgreSQL-Tools verwendet wird. Bevor du den MCP Server nutzen kannst, muss PostgreSQL selbst natuerlich installiert und gestartet sein -- pruefe das mit `pg_isready`. Falls du einen Cloud-Dienst wie Supabase, Neon oder Railway verwendest, findest du den Connection String in den Dashboard-Einstellungen deines Providers. Beachte, dass der Connection String das Passwort im Klartext enthaelt -- speichere ihn deshalb niemals direkt in einer Konfigurationsdatei, die in Git committed wird, sondern nutze Umgebungsvariablen.

```bash
# MCP Server installieren
npm install -g @modelcontextprotocol/server-postgres

# PostgreSQL Connection String format:
# postgresql://username:password@host:port/database
```

### Konfiguration

Die Konfiguration verbindet den MCP Server mit deiner Datenbank und legt Sicherheitsoptionen fest. Besonders wichtig: `admin: false` verhindert DROP- und TRUNCATE-Operationen.

**~/.config/mcp/postgres.json**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      },
      "permissions": {
        "read": true,
        "write": true,
        "schema": true,
        "admin": false  // Kein DROP DATABASE
      },
      "options": {
        "maxConnections": 5,
        "queryTimeout": 30000,
        "safeMode": true  // Bestätigung bei DELETE/DROP
      }
    }
  }
}
```

> ⚠️ **Warnung**: Verwende fuer den MCP-Zugriff niemals den PostgreSQL-Superuser. Erstelle einen dedizierten Benutzer mit eingeschraenkten Rechten und setze `"admin": false` in der Konfiguration, um versehentliche DROP- oder TRUNCATE-Operationen zu verhindern.

### Available MCP Tools

#### 1. `postgres_query`

Dieses Tool fuehrt eine beliebige SQL-Query aus und gibt die Ergebnisse als strukturiertes JSON mit Rows, Feldtypen und Zeilenanzahl zurueck. Es ist das Haupt-Tool des PostgreSQL MCP Servers und wird fuer alle Lese- und Schreiboperationen verwendet. Die Response enthaelt neben den eigentlichen Daten auch die Spaltennamen und ihre PostgreSQL-Datentypen, sodass Claude die Struktur der Ergebnisse versteht. Stell dir vor, du fragst Claude "Zeige mir die letzten 10 Bestellungen" -- Claude formuliert die SQL-Query, fuehrt sie aus und praesentiert die Ergebnisse in einer lesbaren Tabelle. Beachte, dass bei aktiviertem `safeMode` destruktive Queries (DELETE, DROP, TRUNCATE) eine Bestaetigung erfordern.

```json
{
  "name": "postgres_query",
  "description": "Execute SQL query",
  "parameters": {
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

**Response**:
```json
{
  "rows": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ],
  "rowCount": 2,
  "fields": [
    { "name": "id", "type": "integer" },
    { "name": "name", "type": "text" }
  ]
}
```

#### 2. `postgres_schema`

Dieses Tool liest das Datenbankschema aus und liefert Informationen ueber Tabellen, Spalten, Datentypen, Constraints und Beziehungen. Ohne den `table`-Parameter werden alle Tabellen der Datenbank aufgelistet, mit dem Parameter erhaeltst du die detaillierte Struktur einer bestimmten Tabelle. Claude nutzt dieses Tool typischerweise als ersten Schritt, um die Datenbankstruktur zu verstehen, bevor es Queries schreibt oder Migrationen erstellt. Stell dir vor, du uebernimmst ein bestehendes Projekt und willst wissen, wie die Datenbank aufgebaut ist -- `postgres_schema` gibt dir sofort eine vollstaendige Uebersicht aller Tabellen und ihrer Relationen. Die Response enthaelt auch Informationen ueber Indexes, Foreign Keys und Constraints, was Claude hilft, performante und korrekte Queries zu schreiben.

```json
{
  "name": "postgres_schema",
  "description": "Get database schema",
  "parameters": {
    "table": "users"  // Optional: specific table
  }
}
```

#### 3. `postgres_explain`

Dieses Tool analysiert den Ausfuehrungsplan einer Query, ohne sie tatsaechlich auszufuehren, und identifiziert dabei Performance-Engpaesse und fehlende Indexes. Das Ergebnis zeigt, ob PostgreSQL einen Sequential Scan (langsam, liest die gesamte Tabelle) oder einen Index Scan (schnell, nutzt den Index) verwendet. Stell dir vor, eine Query dauert 5 Sekunden statt 50 Millisekunden -- mit `postgres_explain` kann Claude den Ausfuehrungsplan analysieren und feststellen, dass ein Index auf der `user_id`-Spalte fehlt. Claude schlaegt dann das passende `CREATE INDEX`-Statement vor und erklaert die erwartete Performance-Verbesserung. Dieses Tool ist unverzichtbar fuer die Optimierung langsamer Queries in Produktionsdatenbanken.

```json
{
  "name": "postgres_explain",
  "description": "Analyze query performance",
  "parameters": {
    "query": "SELECT * FROM users WHERE email = 'test@example.com'"
  }
}
```

---

## 🏆 Best Practices

Sicherheit und Performance sind bei Datenbank-Operationen besonders wichtig. Die folgenden Practices schuetzen vor SQL Injection und Datenverlust.

### 1. **Parameterized Queries**

Parameterisierte Queries verhindern SQL Injection, indem Benutzereingaben nie direkt in den SQL-String eingefuegt werden. Stattdessen werden Platzhalter (`$1`, `$2`) verwendet, und die Werte werden separat als Array uebergeben. Das ist die wichtigste Sicherheitsmassnahme bei Datenbankzugriffen, da ein Angreifer ueber nicht-parametrisierte Queries beliebigen SQL-Code einschleusen koennte. Stell dir vor, ein User gibt als Suchbegriff `'; DROP TABLE users; --` ein -- ohne Parametrisierung wuerde das die gesamte Users-Tabelle loeschen. Mit Platzhaltern wird die Eingabe als reiner Text behandelt, unabhaengig vom Inhalt. Claude verwendet standardmaessig parametrisierte Queries, aber es ist wichtig, das Pattern zu kennen, falls du eigene Queries schreibst.

```javascript
// ❌ SQL Injection Risk
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Parameterized Query
const query = {
  text: 'SELECT * FROM users WHERE id = $1',
  values: [userId]
};
```

> 💡 **Tipp**: Aktiviere `safeMode: true` in der Konfiguration. Damit wird bei DELETE-, DROP- und TRUNCATE-Operationen eine Bestaetigung verlangt, bevor sie ausgefuehrt werden -- ein wichtiges Sicherheitsnetz fuer Produktionsdatenbanken.

### 2. **Transaction Safety**

Zusammengehoerige Operationen sollten in einer Transaktion ausgefuehrt werden, damit bei einem Fehler alle Aenderungen zurueckgerollt werden. Ohne Transaktion koennten die Daten in einem inkonsistenten Zustand landen, z.B. wenn eine Bestellung erstellt wurde, aber das Inventar nicht aktualisiert werden konnte. Die `transaction`-Methode fuehrt alle enthaltenen Queries als atomare Einheit aus: Entweder sind alle erfolgreich, oder keine wird ausgefuehrt. Stell dir vor, du ueberweist Geld von einem Konto auf ein anderes -- ohne Transaktion koennte das Geld von einem Konto abgebucht werden, ohne auf dem anderen anzukommen. Claude nutzt Transaktionen automatisch bei zusammenhaengenden Operationen wie dem Erstellen einer Bestellung mit Inventaraktualisierung.

```javascript
// Wrap Related Operations in Transaction
await postgres.transaction(async (client) => {
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE inventory ...');
  // Auto-rollback on error
});
```

### 3. **Schema Migrations**

Migrationen dokumentieren Schema-Aenderungen als nummerierte SQL-Dateien, die versioniert und reproduzierbar sind. Jede Migration erhaelt eine aufsteigende Nummer (hier `001_`), damit die Reihenfolge klar ist und Migrationen auf jeder Umgebung in der gleichen Reihenfolge ausgefuehrt werden. Das `CREATE TABLE`-Statement definiert die Tabellenstruktur mit Spaltentypen und Constraints wie `UNIQUE` und `NOT NULL`. Besonders wichtig ist der Index auf der `email`-Spalte: Ohne ihn muesste PostgreSQL bei jeder Suche nach einer E-Mail-Adresse die gesamte Tabelle durchscannen (Sequential Scan), was bei Millionen von Zeilen sehr langsam wird. Stell dir vor, du deployst deine App auf einem neuen Server -- die Migrationen erstellen die Datenbankstruktur automatisch in der richtigen Reihenfolge, ohne dass du manuell eingreifen musst.

```sql
-- Migration: 001_create_users.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

---

## 📝 Beispiele (12+)

### Beispiel 1: Schema Analysis

```bash
Du: "Zeig mir die Struktur der users Tabelle"

Claude:
postgres_schema({ table: "users" })

Ausgabe:
```
Table: users
Columns:
  - id: integer (PRIMARY KEY)
  - email: text (UNIQUE, NOT NULL)
  - name: text
  - created_at: timestamp (DEFAULT now())

Indexes:
  - users_pkey (PRIMARY KEY on id)
  - idx_users_email (INDEX on email)
```

### Beispiel 2: Data Exploration

```bash
Du: "Wie viele Users haben wir?"

Claude:
postgres_query({ query: "SELECT COUNT(*) FROM users" })

→ "Ihr habt 1.234 Users in der Datenbank"
```

### Beispiel 3: Migration Generator

```bash
Du: "Füge ein 'role' Feld zur users Tabelle hinzu"

Claude generiert Migration:
```sql
-- Migration: 002_add_user_role.sql
ALTER TABLE users
ADD COLUMN role TEXT DEFAULT 'user'
  CHECK (role IN ('user', 'admin', 'moderator'));

CREATE INDEX idx_users_role ON users(role);
```

> 🚀 **Beispiel**: Nutze `postgres_explain` um langsame Queries zu analysieren -- Claude liest den EXPLAIN-Plan, identifiziert fehlende Indexes und schlaegt konkrete CREATE INDEX Statements vor.

### Beispiel 4: Query Optimization

```bash
Du: "Warum ist diese Query so langsam?"
Query: SELECT * FROM orders WHERE user_id = 123

Claude:
1. postgres_explain({ query: "..." })
2. Analysiert EXPLAIN Plan

Ausgabe:
```
Performance Issue Found:

❌ Seq Scan on orders (cost=1000..5000)
   → Full table scan, kein Index

Recommendation:
CREATE INDEX idx_orders_user_id ON orders(user_id);

Expected Improvement: 50x faster
```

### Beispiel 5: Seed Data Generator

```bash
Du: "Generiere 100 Test-Users"

Claude:
```sql
INSERT INTO users (name, email)
SELECT
  'User ' || generate_series,
  'user' || generate_series || '@example.com'
FROM generate_series(1, 100);
```

### Beispiel 6: Data Validation

```bash
Du: "Check ob alle Emails valide sind"

Claude:
postgres_query({
  query: "SELECT id, email FROM users WHERE email !~ '^[^@]+@[^@]+\.[^@]+$'"
})

→ "Gefunden: 5 Users mit invaliden Emails"
```

### Beispiel 7: Backup Strategy

```bash
Du: "Erstelle ein Backup der wichtigsten Tabellen"

Claude generiert:
```bash
pg_dump -U user -d mydb -t users -t orders -t payments > backup.sql
```

### Beispiel 8: Index Recommendations

```bash
Du: "Welche Indexes sollte ich erstellen?"

Claude analysiert:
1. Häufige Queries in Logs
2. EXPLAIN Plans
3. Table Sizes

Recommendations:
```sql
-- High Impact
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_payments_status ON payments(status);

-- Medium Impact
CREATE INDEX idx_users_last_login ON users(last_login);
```

### Beispiel 9: Relation Finder

```bash
Du: "Zeig mir alle Tabellen, die auf users referenzieren"

Claude:
postgres_query({
  query: `SELECT ...FROM information_schema.table_constraints...`
})

→ "Foreign Keys auf users:
   - orders.user_id
   - payments.user_id
   - sessions.user_id"
```

### Beispiel 10: Duplicate Detection

```bash
Du: "Find duplizierte Emails"

Claude:
postgres_query({
  query: "SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1"
})

→ "Gefunden: 3 duplizierte Emails
   - test@example.com (2x)
   - admin@example.com (3x)"
```

### Beispiel 11: Data Export

```bash
Du: "Exportiere alle Premium-Users als CSV"

Claude:
```sql
COPY (
  SELECT id, email, created_at
  FROM users
  WHERE plan = 'premium'
) TO '/tmp/premium_users.csv' CSV HEADER;
```

### Beispiel 12: Migration Rollback

```bash
Du: "Rollback die letzte Migration"

Claude:
1. Liest Migration History
2. Generiert Rollback SQL:
```sql
-- Rollback: 002_add_user_role.sql
ALTER TABLE users DROP COLUMN role;
DROP INDEX IF EXISTS idx_users_role;
```

---

## 🤖 Claude Code Integration

### Workflow 1: Datenbank-Schema explorieren

In diesem Workflow nutzt Claude den PostgreSQL MCP Server, um die gesamte Datenbankstruktur zu analysieren und dir eine verstaendliche Uebersicht zu geben. Claude liest alle Tabellen, ihre Spalten, Datentypen und die Beziehungen (Foreign Keys) zwischen ihnen. Stell dir vor, du uebernimmst ein Legacy-Projekt mit 50 Tabellen -- Claude erstellt dir in Sekunden ein Entity-Relationship-Diagramm und erklaert die Architektur. Das ist besonders wertvoll, wenn keine aktuelle Dokumentation vorhanden ist. Claude kann auch Optimierungsvorschlaege machen, z.B. fehlende Indexes oder redundante Spalten identifizieren.

```bash
# In Claude Code Session:
# "Zeige mir alle Tabellen und ihre Relationen in der Datenbank"
# → Claude nutzt MCP PostgreSQL um Schema zu lesen
```

### Workflow 2: MCP Konfiguration

Diese minimale Konfiguration verbindet den PostgreSQL MCP Server mit deiner lokalen Datenbank. Der Connection String `postgresql://user:pass@localhost/mydb` wird als letztes Argument im `args`-Array uebergeben. Aendere `user` und `pass` auf deine tatsaechlichen PostgreSQL-Credentials und `mydb` auf den Namen deiner Datenbank. Fuer Cloud-Datenbanken (Supabase, Neon, Railway) ersetze `localhost` durch den Hostnamen deines Providers. Beachte, dass der Connection String das Passwort im Klartext enthaelt -- nutze fuer Produktionsumgebungen stattdessen die `env`-Sektion mit einer Umgebungsvariable wie `DATABASE_URL`.

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost/mydb"]
    }
  }
}
```

### Workflow 3: Daten-Migration mit Claude Code

Claude kann ueber den MCP Server nicht nur Daten abfragen, sondern auch Schema-Aenderungen als Migrationen erstellen und ausfuehren. Du beschreibst die gewuenschte Aenderung in natuerlicher Sprache, und Claude generiert das passende SQL-Statement mit korrekten Datentypen, Constraints und Indexes. Stell dir vor, du sagst "Fuege eine Spalte fuer die Benutzerrolle zur Users-Tabelle hinzu" -- Claude erstellt ein `ALTER TABLE`-Statement mit einem sinnvollen Default-Wert und einem CHECK-Constraint fuer die erlaubten Rollen. Claude kann auch Rollback-Statements generieren, damit du die Aenderung bei Bedarf rueckgaengig machen kannst.

```bash
# Claude Code kann SQL-Queries ueber MCP ausfuehren:
# "Erstelle eine Migration die eine 'users' Tabelle mit email und name erstellt"
```

> 💡 **Tipp**: Gib Claude Code via MCP PostgreSQL Zugriff auf deine Entwicklungs-Datenbank - so kann es Schema-Aenderungen direkt testen.

---

## 🐛 Troubleshooting

Verbindungsprobleme, fehlende Berechtigungen und Timeouts sind die haeufigsten Schwierigkeiten beim PostgreSQL MCP Server.

### Problem 1: Connection Failed

**Symptom**: `Error: Connection refused`

**Ursache**: PostgreSQL ist nicht gestartet, laeuft auf einem anderen Port, oder der Connection String ist fehlerhaft.

**Lösung**:

Pruefe ob PostgreSQL laeuft und der Connection String korrekt ist:
```bash
# Check PostgreSQL running
pg_isready -h localhost -p 5432

# Check Connection String
echo $DATABASE_URL

# Correct Format:
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### Problem 2: Permission Denied

**Symptom**: `Error: permission denied for table`

**Ursache**: Der Datenbankbenutzer hat nicht die noetige Berechtigung fuer die gewuenschte Operation auf der Tabelle.

**Lösung**:

Vergib die benoetigten Berechtigungen an den MCP-Benutzer:
```sql
-- Grant Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myuser;
```

### Problem 3: Query Timeout

**Symptom**: Query never returns

**Ursache**: Die Query dauert laenger als das konfigurierte Timeout, z.B. durch fehlende Indexes oder Full-Table-Scans auf grossen Tabellen.

**Lösung**:

Erhoehe den Timeout-Wert oder optimiere die Query mit einem Index:
```json
{
  "options": {
    "queryTimeout": 60000  // Erhöhe auf 60s
  }
}
```

---

## 🆚 Vergleich mit Alternativen

| Feature | PostgreSQL MCP | SQLite MCP | Direct psql | Prisma |
|---------|---------------|------------|-------------|--------|
| **Claude Integration** | ✅ Native | ✅ Native | ❌ Shell | ❌ Code-Gen |
| **Structured Output** | ✅ JSON | ✅ JSON | ❌ Text | ✅ JS Objects |
| **Safety Checks** | ✅ Built-in | ✅ Built-in | ❌ Manual | ✅ ORM-Level |
| **Schema Introspection** | ✅ Yes | ✅ Yes | ❌ Manual | ✅ Yes |
| **Performance** | ✅ Fast | ✅ Fast | ✅ Fastest | ❌ Overhead |
| **Multi-Connection** | ✅ Pooling | ❌ Single-File | ✅ Yes | ✅ Yes |
| **Migrations** | ✅ SQL | ✅ SQL | ✅ SQL | ✅ ORM DSL |

---

## 🔗 Nützliche Links

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MCP Postgres Server](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [Supabase](https://supabase.com/) - Managed PostgreSQL

---

## 💎 Pro-Tipps

Fortgeschrittene Techniken fuer Performance-Optimierung und Multi-Umgebungs-Setups.

> 💡 **Tipp**: Setze `queryTimeout` auf einen angemessenen Wert (z.B. 30000ms), um lange laufende Queries automatisch abzubrechen. Das schuetzt vor versehentlichen Full-Table-Scans auf grossen Tabellen.

### 1. Connection Pooling

Connection Pooling vermeidet den Overhead, fuer jede Query eine neue Verbindung aufzubauen. Der `idleTimeout` schliesst ungenutzte Verbindungen automatisch:
```json
{
  "options": {
    "maxConnections": 10,
    "idleTimeout": 30000
  }
}
```

### 2. Read Replicas für Performance

Konfiguriere einen separaten MCP Server fuer Read-Replicas, um Lese-Operationen von der Hauptdatenbank zu entlasten:
```json
{
  "postgres-read": {
    "env": {
      "DATABASE_URL": "postgresql://read-replica-host"
    }
  }
}
```

### 3. Automatic Explain für Slow Queries

Logge automatisch den EXPLAIN-Plan fuer Queries, die laenger als eine Sekunde dauern, um Performance-Probleme frueh zu erkennen:
```javascript
async function queryWithExplain(query) {
  const result = await postgres.query(query);

  if (result.executionTime > 1000) {  // > 1s
    const explain = await postgres.explain(query);
    console.warn("Slow query detected:", explain);
  }

  return result;
}
```

---

## 📚 Zusammenfassung

✅ **PostgreSQL MCP** ermöglicht Claude direkten DB-Zugriff
✅ **Structured Queries** mit JSON Responses
✅ **Safety Features** verhindern destructive Operations
✅ **Schema Introspection** für besseres Verständnis
✅ **Query Optimization** via EXPLAIN Analysis

### Nächste Schritte

1. **Setup** PostgreSQL Connection String
2. **Test** mit einfachen SELECT Queries
3. **Nutze** Schema Introspection
4. **Kombiniere** mit [SQLite MCP](./40-mcp-sqlite.md)

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 40 - SQLite MCP Server](./40-mcp-sqlite.md) →
