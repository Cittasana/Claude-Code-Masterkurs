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
```bash
# Claude generiert SQL + Shell-Command
psql -U user -d mydb -c "SELECT * FROM users WHERE id = 1"
→ Parse Text-Output ist fehleranfällig
```

**Mit MCP**:
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

Der folgende Befehl installiert den PostgreSQL MCP Server. Der Connection String folgt dem Format `postgresql://user:password@host:port/database`:
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

Fuehrt eine SQL-Query aus und gibt die Ergebnisse als strukturiertes JSON mit Rows und Feldtypen zurueck:
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

Liest das Datenbankschema aus -- Tabellen, Spalten, Datentypen und Beziehungen. Ohne `table`-Parameter werden alle Tabellen aufgelistet:
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

Analysiert den Ausfuehrungsplan einer Query, um Performance-Engpaesse und fehlende Indexes zu identifizieren:
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

Parameterisierte Queries verhindern SQL Injection, indem Benutzereingaben nie direkt in den SQL-String eingefuegt werden. Stattdessen werden Platzhalter (`$1`, `$2`) verwendet:
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

Zusammengehoerige Operationen sollten in einer Transaktion ausgefuehrt werden, damit bei einem Fehler alle Aenderungen zurueckgerollt werden:
```javascript
// Wrap Related Operations in Transaction
await postgres.transaction(async (client) => {
  await client.query('INSERT INTO orders ...');
  await client.query('UPDATE inventory ...');
  // Auto-rollback on error
});
```

### 3. **Schema Migrations**

Migrationen dokumentieren Schema-Aenderungen als SQL-Dateien, die versioniert und reproduzierbar sind. Erstelle immer einen Index fuer haeufig abgefragte Spalten:
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
```bash
# In Claude Code Session:
# "Zeige mir alle Tabellen und ihre Relationen in der Datenbank"
# → Claude nutzt MCP PostgreSQL um Schema zu lesen
```

### Workflow 2: MCP Konfiguration
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
