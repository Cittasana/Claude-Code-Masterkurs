# 40. MCP Server: SQLite

**Kategorie**: Database MCP Server
**Schwierigkeit**: Anfänger
**Installation**: `npx @modelcontextprotocol/create-server sqlite`
**Offizielle Docs**: [MCP SQLite Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite)

---

> 🚀 **Claude Code Relevanz**: Der SQLite MCP Server ist perfekt fuer lokale Entwicklung und Prototyping mit Claude Code -- Zero Setup, sofortige Datenbank-Operationen direkt in deinem Projekt.

## 🎯 Was ist der SQLite MCP Server?

Der **SQLite MCP Server** gibt Claude Code Zugriff auf SQLite Datenbanken - perfekt für lokale Development, Testing und Prototyping. SQLite ist ein file-based Database System ohne Server-Setup.

### Warum SQLite via MCP?

**Ohne MCP**:

Ohne den MCP Server muss Claude das `sqlite3`-Kommandozeilen-Tool verwenden und den Text-Output parsen. Die Ausgabe von `sqlite3` ist standardmaessig als Pipe-getrennte Tabelle formatiert, was fuer Menschen schwer lesbar und fuer Maschinen schwer parsbar ist. Stell dir vor, eine Spalte enthaelt ein Pipe-Zeichen (`|`) -- dann bricht das gesamte Parsing zusammen. Ausserdem erhaelt Claude keine Informationen ueber die Datentypen der Spalten. Fuer einfache Abfragen mag das funktionieren, aber bei komplexeren Queries mit Joins und Aggregationen wird der Text-Output schnell unuebersichtlich.

```bash
sqlite3 mydb.sqlite "SELECT * FROM users"
→ Text-Output, schwer zu parsen
```

**Mit MCP**:

Mit dem SQLite MCP Server fuehrt Claude Queries ueber die MCP-Schnittstelle aus und erhaelt eine strukturierte JSON-Response zurueck, die sofort weiterverarbeitet werden kann. Der `database`-Parameter gibt den Pfad zur SQLite-Datei an, und `query` enthaelt die SQL-Abfrage. Claude kann die Ergebnisse direkt als Tabelle praesentieren, Charts erstellen oder weitere Analysen durchfuehren. Ein besonderer Vorteil: Der MCP Server kann auch In-Memory-Datenbanken (`:memory:`) verwenden, was perfekt fuer schnelle Prototypen und Tests ist. Die Fehlerbehandlung ist ebenfalls besser, da SQL-Fehler als strukturierte JSON-Objekte mit Fehlercode und Beschreibung zurueckkommen.

```json
{
  "method": "sqlite_query",
  "params": {
    "database": "mydb.sqlite",
    "query": "SELECT * FROM users"
  }
}
→ Strukturierte JSON-Response
```

---

## 🔧 Berechtigung

### Warum SQLite MCP?

1. **Zero Setup**: Keine Server-Installation nötig
2. **Portable**: DB ist ein single File
3. **Perfect für Prototyping**: Schnell iterieren
4. **Testing**: In-Memory DBs für Tests
5. **Mobile/Desktop Apps**: Eingebauter DB für Apps

### Use Cases

- **Local Development**: Entwickle lokal mit SQLite, deploy mit PostgreSQL
- **Testing**: In-Memory DBs für Unit Tests
- **Embedded Apps**: Desktop/Mobile Apps mit lokaler DB
- **Data Analysis**: Analyse von CSV → SQLite → Visualisierung
- **Caching Layer**: SQLite als Fast Cache

---

## 💻 Verwendung

Von der Installation bis zu den verfuegbaren MCP Tools -- SQLite ist oft bereits vorinstalliert, sodass das Setup besonders einfach ist.

### Installation & Setup

Die folgenden Befehle installieren den SQLite MCP Server auf deinem System. Der erste Befehl installiert das npm-Paket global, und der zweite prueft, ob SQLite bereits auf deinem System vorhanden ist -- auf macOS und den meisten Linux-Distributionen ist es standardmaessig vorinstalliert. Im Gegensatz zu PostgreSQL brauchst du keinen separaten Datenbankserver zu starten, da SQLite direkt auf Dateiebene arbeitet. Stell dir vor, du willst schnell einen Prototyp mit Datenbankanbindung bauen -- mit SQLite erstellst du die Datenbank einfach als Datei in deinem Projektordner, ohne irgendetwas zu konfigurieren. Falls `sqlite3 --version` einen Fehler ausgibt, kannst du SQLite ueber deinen Paketmanager nachinstallieren (z.B. `brew install sqlite3` auf macOS).

```bash
# MCP Server installieren
npm install -g @modelcontextprotocol/server-sqlite

# SQLite ist meist pre-installed auf macOS/Linux
sqlite3 --version
```

### Konfiguration

Die Konfiguration listet die erlaubten Datenbank-Dateien auf. Beachte, dass SQLite nur einen gleichzeitigen Schreibvorgang unterstuetzt (`maxConnections: 1`).

**~/.config/mcp/sqlite.json**:
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite"
      ],
      "databases": [
        "/Users/username/projects/app/dev.db",
        "/Users/username/projects/app/test.db"
      ],
      "options": {
        "readOnly": false,
        "maxConnections": 1,  // SQLite hat single writer
        "busyTimeout": 5000
      }
    }
  }
}
```

> 💡 **Tipp**: Gib in der `databases`-Liste nur die Pfade zu den SQLite-Dateien an, die Claude tatsaechlich benoetigt. Setze `readOnly: true` fuer Produktionsdaten, um versehentliche Aenderungen zu verhindern.

### Available MCP Tools

#### 1. `sqlite_query`

Dieses Tool fuehrt eine SQL-Query auf einer bestimmten Datenbank-Datei aus und gibt die Ergebnisse als JSON zurueck. Der `database`-Parameter erwartet den Dateinamen oder Pfad zur SQLite-Datei, die in der `databases`-Liste der Konfiguration eingetragen sein muss. Claude kann damit sowohl Lese- als auch Schreiboperationen durchfuehren, abhaengig von der `readOnly`-Einstellung. Stell dir vor, du hast eine `dev.db` mit Testdaten und fragst Claude "Wie viele Benutzer haben sich diese Woche registriert?" -- Claude formuliert die passende SQL-Query mit Datumsfilter und fuehrt sie aus. Das Ergebnis wird als JSON-Array zurueckgegeben, das Claude sofort in eine lesbare Tabelle umwandeln kann.

```json
{
  "name": "sqlite_query",
  "description": "Execute SQL query",
  "parameters": {
    "database": "dev.db",
    "query": "SELECT * FROM users LIMIT 10"
  }
}
```

#### 2. `sqlite_schema`

Dieses Tool liest das Schema der gesamten Datenbank oder einer bestimmten Tabelle aus und liefert Informationen ueber alle Tabellen, Spalten, Datentypen und Indexes. Claude nutzt es typischerweise als ersten Schritt, um die Struktur einer SQLite-Datenbank zu verstehen, bevor es Queries schreibt. Stell dir vor, du hast eine SQLite-Datei aus einem anderen Projekt erhalten und willst wissen, welche Tabellen und Spalten sie enthaelt -- `sqlite_schema` gibt dir sofort eine vollstaendige Uebersicht. Die Response enthaelt die CREATE-Statements, die Claude nutzen kann, um die gleiche Struktur in einer neuen Datenbank zu replizieren. Das ist auch nuetzlich, um zu pruefen, ob eine Migration korrekt ausgefuehrt wurde.

```json
{
  "name": "sqlite_schema",
  "description": "Get database schema",
  "parameters": {
    "database": "dev.db"
  }
}
```

#### 3. `sqlite_transaction`

Dieses Tool fuehrt mehrere Queries als eine atomare Transaktion aus -- entweder werden alle erfolgreich ausgefuehrt oder keine. Das ist besonders wichtig bei zusammenhaengenden Operationen, die nicht isoliert sinnvoll sind. In diesem Beispiel wird ein neuer User erstellt und gleichzeitig eine zugehoerige Bestellung angelegt, wobei `last_insert_rowid()` automatisch die ID des gerade erstellten Users verwendet. Stell dir vor, der INSERT in die `orders`-Tabelle schlaegt fehl -- ohne Transaktion haettest du einen User ohne Bestellung, mit Transaktion wird auch der User-INSERT zurueckgerollt. Claude nutzt Transaktionen automatisch, wenn es zusammengehoerige Datenoperationen ausfuehrt.

```json
{
  "name": "sqlite_transaction",
  "description": "Execute multiple queries in transaction",
  "parameters": {
    "database": "dev.db",
    "queries": [
      "INSERT INTO users (name) VALUES ('Alice')",
      "INSERT INTO orders (user_id) VALUES (last_insert_rowid())"
    ]
  }
}
```

---

## 🏆 Best Practices

Die folgenden Best Practices helfen dir, SQLite effizient und sicher einzusetzen -- besonders wichtig sind der WAL-Modus fuer Concurrency und Foreign Keys.

### 1. **In-Memory für Tests**

In-Memory-Datenbanken existieren nur im Arbeitsspeicher und werden nach dem Test automatisch geloescht, ohne Spuren auf der Festplatte zu hinterlassen. Perfekt fuer schnelle Unit Tests, da jeder Test mit einer frischen, leeren Datenbank startet und keine Aufraeum-Logik benoetigt wird. Der spezielle Datenbankname `:memory:` signalisiert SQLite, die Datenbank im RAM statt auf der Festplatte anzulegen. Stell dir vor, du hast 200 Unit Tests, die jeweils eine saubere Datenbank brauchen -- mit In-Memory-Datenbanken dauert das Erstellen und Befuellen jeweils nur Millisekunden statt Sekunden. Beachte, dass In-Memory-Datenbanken nicht zwischen verschiedenen Verbindungen geteilt werden koennen und alle Daten beim Schliessen der Verbindung verloren gehen.

```javascript
// Perfekt für Unit Tests
const testDb = ':memory:';  // In-Memory DB

await sqlite.query({
  database: testDb,
  query: 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)'
});
```

> ⚠️ **Warnung**: SQLite unterstuetzt nur einen gleichzeitigen Schreibvorgang. Wenn du den MCP Server zusammen mit deiner Anwendung nutzt, aktiviere unbedingt den WAL-Modus und setze einen `busyTimeout`, um Lock-Konflikte zu vermeiden.

### 2. **WAL Mode für Concurrency**

Write-Ahead Logging (WAL) erlaubt gleichzeitiges Lesen und Schreiben, was die Standard-Sperre deutlich entschaerft. Im Default-Modus sperrt SQLite die gesamte Datenbank bei jedem Schreibvorgang, sodass Leser warten muessen. Mit WAL koennen Leser parallel zum Schreiber arbeiten, weil Aenderungen erst in eine separate WAL-Datei geschrieben und spaeter in die Hauptdatenbank uebernommen werden. Stell dir vor, deine Anwendung liest Daten, waehrend der MCP Server gleichzeitig schreibt -- ohne WAL wuerde einer von beiden mit einem "database is locked"-Fehler abbrechen. Aktiviere WAL einmalig pro Datenbank, die Einstellung bleibt dauerhaft gespeichert. Die WAL-Datei wird automatisch verwaltet und braucht keinen manuellen Eingriff.

```sql
-- Enable Write-Ahead Logging für bessere Concurrency
PRAGMA journal_mode=WAL;
```

### 3. **Foreign Keys aktivieren**

SQLite erzwingt Foreign Keys standardmaessig nicht, was bedeutet, dass du ohne diese Einstellung problemlos Bestellungen fuer nicht-existierende Benutzer erstellen koenntest. Aktiviere Foreign Keys explizit mit diesem PRAGMA-Befehl, um referentielle Integritaet sicherzustellen. Beachte, dass dieser Befehl bei jeder neuen Verbindung erneut ausgefuehrt werden muss -- er wird nicht dauerhaft gespeichert. Stell dir vor, du loeschst einen User, der noch aktive Bestellungen hat -- ohne Foreign Keys bleiben verwaiste Bestellungen in der Datenbank zurueck, mit Foreign Keys wird das Loeschen blockiert oder die Bestellungen werden kaskadiert geloescht (je nach ON DELETE-Regel). Claude aktiviert diese Option automatisch, wenn es eine Datenbank mit Relationen erstellt.

```sql
-- Foreign Keys sind default OFF in SQLite
PRAGMA foreign_keys = ON;
```

---

## 📝 Beispiele (12+)

### Beispiel 1: CSV zu SQLite Import

```bash
Du: "Importiere data.csv in eine SQLite DB"

Claude:
1. Erstellt DB und Table
2. Liest CSV via filesystem MCP
3. INSERT Statements generieren

```sql
CREATE TABLE data (
  id INTEGER PRIMARY KEY,
  name TEXT,
  value REAL
);

-- Import CSV
.mode csv
.import data.csv data
```

### Beispiel 2: Quick Data Analysis

```bash
Du: "Analysiere die Top 10 Produkte nach Umsatz"

Claude:
sqlite_query({
  query: `
    SELECT product_name, SUM(price * quantity) as revenue
    FROM orders
    GROUP BY product_name
    ORDER BY revenue DESC
    LIMIT 10
  `
})

→ Zeigt Top-10 mit Chart
```

### Beispiel 3: Schema Migration

```bash
Du: "Füge email zur users Tabelle hinzu"

Claude generiert:
```sql
-- SQLite doesn't support ALTER COLUMN, use recreate
BEGIN TRANSACTION;

CREATE TABLE users_new (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE
);

INSERT INTO users_new (id, name)
SELECT id, name FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

COMMIT;
```

> 🚀 **Beispiel**: Nutze In-Memory-Datenbanken (`:memory:`) fuer schnelle Prototypen und Tests -- Claude erstellt Schema und Testdaten in Sekunden, ohne Dateien auf der Festplatte zu hinterlassen.

### Beispiel 4: Full-Text Search

```bash
Du: "Implementiere Suche für Artikel"

Claude:
```sql
-- Create FTS5 Table
CREATE VIRTUAL TABLE articles_fts
USING fts5(title, content);

-- Insert Data
INSERT INTO articles_fts
SELECT title, content FROM articles;

-- Search Query
SELECT * FROM articles_fts
WHERE articles_fts MATCH 'claude code'
ORDER BY rank;
```

### Beispiel 5: JSON Support

```bash
Du: "Query JSON Data in SQLite"

Claude:
```sql
-- SQLite has JSON Functions
SELECT
  json_extract(data, '$.user.name') as name,
  json_extract(data, '$.user.email') as email
FROM events
WHERE json_extract(data, '$.type') = 'signup';
```

### Beispiel 6: Backup & Restore

```bash
Du: "Erstelle Backup von dev.db"

Claude:
```bash
# Backup
sqlite3 dev.db ".backup backup.db"

# Restore
sqlite3 new.db ".restore backup.db"
```

### Beispiel 7: Performance Analysis

```bash
Du: "Warum ist meine Query langsam?"

Claude:
```sql
-- EXPLAIN QUERY PLAN
EXPLAIN QUERY PLAN
SELECT * FROM orders WHERE user_id = 123;

→ SCAN TABLE orders
  Recommendation: CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### Beispiel 8: Test Data Generator

```bash
Du: "Generiere 1000 Test-Users"

Claude:
```sql
WITH RECURSIVE cnt(x) AS (
  VALUES(1)
  UNION ALL
  SELECT x+1 FROM cnt WHERE x<1000
)
INSERT INTO users (name, email)
SELECT
  'User ' || x,
  'user' || x || '@example.com'
FROM cnt;
```

### Beispiel 9: Data Validation

```bash
Du: "Check Data-Integrität"

Claude:
```sql
-- Find Orphaned Records
SELECT orders.id
FROM orders
LEFT JOIN users ON orders.user_id = users.id
WHERE users.id IS NULL;
```

### Beispiel 10: Duplicate Removal

```bash
Du: "Remove Duplicate Emails"

Claude:
```sql
DELETE FROM users
WHERE rowid NOT IN (
  SELECT MIN(rowid)
  FROM users
  GROUP BY email
);
```

### Beispiel 11: Time-Series Data

```bash
Du: "Aggregiere Hourly Stats"

Claude:
```sql
SELECT
  strftime('%Y-%m-%d %H:00', created_at) as hour,
  COUNT(*) as count,
  AVG(value) as avg_value
FROM events
GROUP BY hour
ORDER BY hour DESC;
```

### Beispiel 12: Export to JSON

```bash
Du: "Exportiere Users als JSON"

Claude:
```sql
SELECT json_group_array(
  json_object(
    'id', id,
    'name', name,
    'email', email
  )
) as users_json
FROM users;
```

---

## 🤖 Claude Code Integration

### Workflow 1: Lokale Datenbank erstellen

Claude kann ueber den SQLite MCP Server komplette Datenbankstrukturen erstellen, von der Tabellendefinition bis zur Befuellung mit Testdaten. Du beschreibst einfach, was du brauchst, z.B. "Erstelle eine SQLite-Datenbank fuer eine Todo-App", und Claude generiert die CREATE TABLE Statements mit sinnvollen Spalten, Datentypen und Constraints. Stell dir vor, du willst in 5 Minuten einen Prototyp mit persistenter Datenhaltung haben -- Claude erstellt die Datenbank, fuellt sie mit Beispieldaten und gibt dir die fertigen CRUD-Queries. Die Datenbankdatei wird direkt in deinem Projektverzeichnis angelegt und kann sofort von deiner Anwendung verwendet werden.

```bash
# Claude Code erstellt und verwaltet SQLite-Datenbanken ueber MCP
# "Erstelle eine SQLite-Datenbank fuer eine Todo-App"
```

### Workflow 2: MCP Konfiguration

Diese minimale Konfiguration verbindet den SQLite MCP Server mit einer bestimmten Datenbankdatei. Der Pfad zur `.db`-Datei wird als letztes Argument im `args`-Array uebergeben und muss entweder absolut oder relativ zum Arbeitsverzeichnis sein. Falls die Datei noch nicht existiert, wird sie beim ersten Zugriff automatisch erstellt -- das ist ein grosser Vorteil von SQLite gegenueber PostgreSQL, wo du die Datenbank erst manuell anlegen musst. Du kannst den Pfad auch auf `:memory:` setzen, um eine reine In-Memory-Datenbank ohne Festplattennutzung zu verwenden. Fuer mehrere Datenbanken fuege einfach weitere Pfade als Argumente hinzu oder nutze die `databases`-Konfiguration aus der ausfuehrlichen Konfiguration weiter oben.

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "path/to/database.db"]
    }
  }
}
```

### Workflow 3: Daten-Analyse

Claude kann SQLite-Datenbanken als Analysetool nutzen, indem es SQL-Aggregationen, Gruppierungen und Berechnungen ausfuehrt und die Ergebnisse als Reports praesentiert. Stell dir vor, du hast Verkaufsdaten in einer SQLite-Datenbank und fragst Claude "Welche Produkte laufen am besten?" -- Claude schreibt die passende SQL-Query mit GROUP BY und ORDER BY und praesentiert die Ergebnisse als uebersichtliche Tabelle. Claude kann auch Trends erkennen, indem es Zeitreihen analysiert und Veraenderungen gegenueber der Vorperiode berechnet. Das macht SQLite mit dem MCP Server zu einem schnellen, lokalen Analyse-Tool, das ohne externe BI-Software funktioniert.

```bash
# "Analysiere die Verkaufsdaten in der SQLite-Datenbank und zeige Trends"
# Claude liest Tabellen, fuehrt Queries aus und erstellt Reports
```

> 💡 **Tipp**: SQLite MCP ist perfekt fuer Prototyping - Claude Code kann Datenbanken erstellen, befuellen und abfragen ohne externen Server.

---

## 🐛 Troubleshooting

Die haeufigsten SQLite-Probleme betreffen Locking, Foreign Keys und Performance. Hier findest du Ursachen und Loesungen.

### Problem 1: Database Locked

**Symptom**: `Error: database is locked`

**Ursache**: Ein anderer Prozess (z.B. deine Anwendung) haelt gerade eine Schreibsperre auf der Datenbank. SQLite erlaubt nur einen gleichzeitigen Schreibvorgang.

**Lösung**:

Aktiviere den WAL-Modus fuer bessere Concurrency und setze einen Busy-Timeout, damit SQLite bei einer Sperre wartet statt sofort abzubrechen:
```bash
# Enable WAL Mode
sqlite3 mydb.db "PRAGMA journal_mode=WAL;"

# Oder: Erhöhe Busy Timeout
PRAGMA busy_timeout = 5000;
```

### Problem 2: Foreign Keys nicht enforced

**Symptom**: Kann orphaned records erstellen

**Ursache**: Foreign Keys sind in SQLite standardmaessig deaktiviert und muessen bei jeder Verbindung neu aktiviert werden.

**Lösung**:

Fuege den PRAGMA-Befehl am Anfang jeder Session aus:
```sql
-- Enable Foreign Keys
PRAGMA foreign_keys = ON;
```

### Problem 3: Slow Queries

**Symptom**: Query dauert lange

**Ursache**: Fehlende Indexes fuehren zu Full-Table-Scans. Der ANALYZE-Befehl hilft dem Query-Optimizer, bessere Plaene zu erstellen.

**Lösung**:

Erstelle Indexes fuer haeufig abgefragte Spalten und fuehre ANALYZE aus:
```sql
-- Create Indexes
CREATE INDEX idx_users_email ON users(email);

-- Analyze für Query Optimizer
ANALYZE;
```

---

## 🆚 Vergleich

| Feature | SQLite MCP | PostgreSQL MCP | JSON Files | In-Memory Objects |
|---------|------------|----------------|------------|------------------|
| **Setup Complexity** | ✅ Zero | ❌ High | ✅ Zero | ✅ Zero |
| **Performance** | ✅ Fast | ✅ Faster | ❌ Slow | ✅ Fastest |
| **Concurrency** | ❌ Limited | ✅ High | ❌ None | ❌ None |
| **Persistence** | ✅ File | ✅ Server | ✅ File | ❌ RAM Only |
| **Portability** | ✅ Single File | ❌ Dump/Restore | ✅ Yes | ❌ No |
| **Query Power** | ✅ SQL | ✅ SQL | ❌ Manual | ❌ Manual |
| **Size Limit** | ✅ 280 TB | ✅ Unlimited | ❌ File System | ❌ RAM |

### Wann SQLite?

- ✅ Local Development & Testing
- ✅ Embedded Apps (Desktop/Mobile)
- ✅ Prototyping
- ✅ Small-Medium Datasets (<10 GB)
- ❌ High Concurrency (>100 writes/s)
- ❌ Multi-Server Setup

---

## 🔗 Nützliche Links

- [SQLite Docs](https://www.sqlite.org/docs.html)
- [MCP SQLite Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite)
- [SQLite Browser](https://sqlitebrowser.org/) - GUI Tool

---

## 💎 Pro-Tipps

Fortgeschrittene Techniken fuer nahtlose Migration zwischen SQLite und PostgreSQL sowie Multi-Datenbank-Setups.

> 💡 **Tipp**: Nutze SQLite fuer lokale Entwicklung mit identischem Schema wie deine PostgreSQL-Produktionsdatenbank. So kannst du schnell iterieren und spaeter nahtlos auf PostgreSQL MCP umsteigen.

### 1. Development → Production Migration

Mit einem ORM wie Prisma kannst du lokal mit SQLite entwickeln und in Production auf PostgreSQL wechseln, ohne den Code zu aendern:
```javascript
// Local Development mit SQLite
DATABASE_URL=sqlite:./dev.db

// Production mit PostgreSQL
DATABASE_URL=postgresql://prod-host/db

// Code bleibt identisch (via ORM wie Prisma)
```

### 2. Multi-DB Setup

Konfiguriere mehrere Datenbanken fuer verschiedene Zwecke -- Development, Tests und Analytics:
```json
{
  "databases": [
    "/path/to/dev.db",      // Development
    ":memory:",             // In-Memory Tests
    "/path/to/analytics.db" // Separate Analytics
  ]
}
```

### 3. Automatic Schema Sync

Synchronisiere das Schema von deiner PostgreSQL-Produktion automatisch in eine lokale SQLite-Datenbank:
```javascript
// Sync Schema from PostgreSQL to SQLite
async function syncSchema() {
  const pgSchema = await postgres.schema();
  const sqliteSchema = generateSQLiteFromPG(pgSchema);
  await sqlite.query({ query: sqliteSchema });
}
```

---

## 📚 Zusammenfassung

✅ **SQLite MCP** perfekt für lokale Entwicklung und Testing
✅ **Zero Setup** - keine Server-Installation nötig
✅ **Portable** - DB ist ein single File
✅ **Fast** - In-Process Database
✅ **Standard SQL** - Familiar Syntax

### Nächste Schritte

1. **Erstelle** erste SQLite DB
2. **Teste** Queries via MCP
3. **Nutze** für lokale Development
4. **Kombiniere** mit [PostgreSQL MCP](./39-mcp-postgres.md) für Production

---

**Erstellt für**: Claude Code Masterkurs
**Autor**: Cosmo
**Letzte Aktualisierung**: 12. Februar 2026
**Version**: 1.0

**Next**: [Lektion 41 - GitHub MCP Server](./41-mcp-github.md) →
