/**
 * Validation Registry
 *
 * Maps project and playground-task IDs to their validation functions.
 * These `check` functions cannot be stored in the database, so they
 * live here as a runtime registry while the metadata (name, description,
 * points) is persisted in ProjectConfig.validationMeta / PlaygroundTaskConfig.
 */

// ── Project Validations ─────────────────────────────────────────

export interface ProjectValidationTest {
  name: string;
  description: string;
  check: () => boolean | Promise<boolean>;
  points: number;
}

export const projectValidations: Record<string, ProjectValidationTest[]> = {
  'proj-1-1': [
    { name: 'Projekt erstellt', description: 'Das Projekt wurde mit Claude Code initialisiert', check: () => true, points: 10 },
    { name: 'CLI Funktionalität', description: 'Das Tool kann über die Kommandozeile gestartet werden', check: () => true, points: 15 },
    { name: 'Datei-Sortierung', description: 'Dateien werden korrekt nach Typ kategorisiert', check: () => true, points: 20 },
    { name: 'Fehlerbehandlung', description: 'Ungültige Pfade und Berechtigungen werden behandelt', check: () => true, points: 15 },
    { name: 'README vorhanden', description: 'Dokumentation mit Nutzungsanleitung erstellt', check: () => true, points: 10 },
  ],
  'proj-1-2': [
    { name: 'Projekt-Erkennung', description: 'Erkennt den Projekt-Typ korrekt', check: () => true, points: 15 },
    { name: 'CLAUDE.md Generierung', description: 'Generiert eine valide CLAUDE.md Datei', check: () => true, points: 20 },
    { name: 'Context-Qualität', description: 'Die generierte CLAUDE.md enthält relevanten Context', check: () => true, points: 20 },
    { name: 'Template-System', description: 'Verschiedene Templates für verschiedene Projekttypen', check: () => true, points: 15 },
  ],
  'proj-1-3': [
    { name: 'Datei-Analyse', description: 'Alle Dateien im Projekt werden analysiert', check: () => true, points: 15 },
    { name: 'Token-Zählung', description: 'Korrekte Berechnung des Token-Verbrauchs', check: () => true, points: 20 },
    { name: 'Visualisierung', description: 'Ergebnisse werden visuell dargestellt', check: () => true, points: 20 },
    { name: 'Optimierungsvorschläge', description: 'Tool gibt konkrete Verbesserungsvorschläge', check: () => true, points: 15 },
  ],
  'proj-2-1': [
    { name: 'MCP Server läuft', description: 'Server startet und akzeptiert Verbindungen', check: () => true, points: 15 },
    { name: 'Tool Registration', description: 'Mindestens 3 Tools sind registriert', check: () => true, points: 20 },
    { name: 'API Integration', description: 'Externe API wird korrekt angebunden', check: () => true, points: 20 },
    { name: 'Error Handling', description: 'Fehler werden sauber behandelt und geloggt', check: () => true, points: 15 },
    { name: 'Claude Code Integration', description: 'Server funktioniert als MCP in Claude Code', check: () => true, points: 20 },
  ],
  'proj-2-2': [
    { name: 'Pipeline-Architektur', description: 'Klar definierte Pipeline-Stufen', check: () => true, points: 15 },
    { name: 'Subagent Orchestration', description: 'Mindestens 3 Subagents arbeiten koordiniert', check: () => true, points: 25 },
    { name: 'Parallele Verarbeitung', description: 'Agents laufen parallel wo möglich', check: () => true, points: 20 },
    { name: 'Fehlertoleranz', description: 'Pipeline handelt Fehler einzelner Agents', check: () => true, points: 15 },
    { name: 'Ergebnis-Aggregation', description: 'Daten werden korrekt zusammengeführt', check: () => true, points: 15 },
  ],
  'proj-2-3': [
    { name: 'Agent-Definition', description: 'CLAUDE.md mit klarer Personality definiert', check: () => true, points: 20 },
    { name: 'Custom Commands', description: 'Mindestens 3 Custom Commands erstellt', check: () => true, points: 20 },
    { name: 'Konsistentes Verhalten', description: 'Agent verhält sich konsistent über Sessions', check: () => true, points: 20 },
    { name: 'Spezialisierung', description: 'Agent hat klare Expertise in seinem Bereich', check: () => true, points: 15 },
    { name: 'Dokumentation', description: 'README mit Nutzungsanleitung', check: () => true, points: 10 },
  ],
  'proj-3-1': [
    { name: 'Hook-System', description: 'Pre-commit und Pre-push Hooks konfiguriert', check: () => true, points: 20 },
    { name: 'Automatische Tests', description: 'Tests laufen automatisch bei jedem Push', check: () => true, points: 20 },
    { name: 'Deployment Automation', description: 'Code wird automatisch deployed', check: () => true, points: 25 },
    { name: 'Rollback', description: 'Automatischer Rollback bei Fehlern', check: () => true, points: 15 },
    { name: 'Monitoring', description: 'Health-Checks und Notifications eingerichtet', check: () => true, points: 15 },
  ],
  'proj-3-2': [
    { name: 'PR Detection', description: 'Neue PRs werden automatisch erkannt', check: () => true, points: 15 },
    { name: 'Code Analyse', description: 'Mehrdimensionale Code-Analyse (Bugs, Style, Performance)', check: () => true, points: 25 },
    { name: 'Review Comments', description: 'Inline-Kommentare werden erstellt', check: () => true, points: 20 },
    { name: 'Auto-Fix', description: 'Automatische Fix-PRs für einfache Probleme', check: () => true, points: 25 },
    { name: 'Konfigurierbar', description: 'Review-Regeln sind konfigurierbar', check: () => true, points: 10 },
  ],
  'proj-3-3': [
    { name: 'Multi-MCP Orchestration', description: 'Mindestens 3 MCP Server werden koordiniert', check: () => true, points: 25 },
    { name: 'Proaktive Vorschläge', description: 'Agent macht eigenständig Verbesserungsvorschläge', check: () => true, points: 20 },
    { name: 'Stil-Adaption', description: 'Agent lernt und adaptiert Coding-Stil', check: () => true, points: 20 },
    { name: 'Automatisierung', description: 'Mindestens 5 automatisierte Workflows', check: () => true, points: 20 },
    { name: 'Dokumentation & Dashboard', description: 'Vollständige Docs und Aktivitäts-Dashboard', check: () => true, points: 15 },
  ],
};

/** minScore per project */
export const projectMinScores: Record<string, number> = {
  'proj-1-1': 50,
  'proj-1-2': 50,
  'proj-1-3': 50,
  'proj-2-1': 60,
  'proj-2-2': 60,
  'proj-2-3': 60,
  'proj-3-1': 70,
  'proj-3-2': 70,
  'proj-3-3': 70,
};
