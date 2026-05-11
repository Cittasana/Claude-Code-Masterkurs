# Claude Code Befehl: Prompt Studio Integration

Kopiere den folgenden Befehl und füge ihn in Claude Code ein:

---

```
Integriere das Prompt Studio Tool in den Claude Code Masterkurs. Die Quelldatei liegt unter ./prompt-optimizer-tool.jsx und muss als neue Page in die bestehende React/TypeScript/Vite-App eingebunden werden.

## Projektstruktur (bestehendes Pattern)

Die App nutzt:
- React 18 + TypeScript + Vite + Tailwind CSS
- React Router (BrowserRouter) mit Lazy Loading in src/App.tsx
- Pages liegen in src/pages/ als *View.tsx Dateien
- Komponenten in src/components/ (Unterordner pro Feature)
- Zustand-Stores in src/store/ (useAuthStore, useUserProgress, useAnalyticsStore)
- Navigation in src/components/Navigation/Navigation.tsx

## Aufgaben

### 1. Page erstellen
- Erstelle `src/pages/PromptStudioView.tsx`
- Konvertiere den JSX-Code aus `./prompt-optimizer-tool.jsx` zu TypeScript (.tsx)
- Ersetze alle inline-Styles durch Tailwind-Klassen, passend zum bestehenden Design-System (dark theme: bg-apple-bg, etc.)
- Nutze die bestehenden UI-Komponenten aus src/components/UI/ wo möglich (LoadingSpinner, etc.)
- Integriere useAuthStore für Paywall-Check (Premium-Feature) und useAnalyticsStore für Event-Tracking

### 2. Route registrieren
- In src/App.tsx:
  - Lazy import hinzufügen: `const PromptStudioView = lazy(() => import('./pages/PromptStudioView'));`
  - Route hinzufügen: `<Route path="/prompt-studio" element={<PromptStudioView />} />`
  - Platzierung nach der /glossar Route

### 3. Navigation einbinden
- In src/components/Navigation/Navigation.tsx:
  - Neuen Nav-Link "Prompt Studio" hinzufügen im Tools/Werkzeuge-Bereich
  - Icon: Sparkles oder Wand (aus dem bestehenden Icon-Set)
  - Badge "NEU" anzeigen (wie bei anderen neuen Features)

### 4. Dashboard-Widget
- In src/pages/DashboardView.tsx oder src/components/Dashboard/:
  - Promo-Card für "Prompt Studio" hinzufügen
  - Kurzbeschreibung: "Generiere & optimiere Prompts für Claude Code Projekte"
  - CTA-Button der zu /prompt-studio navigiert

### 5. TypeScript-Typen
- Erstelle src/types/promptStudio.ts mit Interfaces für:
  - PromptCategory, PromptTemplate, AnalysisResult, ProjectPlan, Phase, PlannerFields
  - Alle aus der JSX-Datei extrahieren und typisieren

### 6. Tailwind-Anpassung
- Die JSX-Datei nutzt ein eigenes Dark-Theme mit Inline-Styles. Mappe diese auf das bestehende Tailwind-Design:
  - #0a0a0f → bg-apple-bg (oder nächster Wert)
  - #1a1a2e → bg-apple-card
  - #6366f1 → bestehende Primary-Color
  - #8b5cf6 → bestehende Accent-Color
  - Behalte die 3 Modus-Farben (Blau=Generator, Grün=Optimizer, Lila=Planner) als accent bei

### 7. Analytics-Events tracken
- logEvent('prompt_studio_opened') beim Seitenbesuch
- logEvent('prompt_generated', { category, mode }) bei Generation
- logEvent('prompt_optimized', { score }) bei Optimierung
- logEvent('project_analyzed', { phases, features }) bei Projektanalyse
- logEvent('prompt_downloaded', { filename }) bei Download

### 8. Paywall-Integration
- Prüfe ob der User ein aktives Abo hat (useAuthStore)
- Free-Tier: Generator-Modus mit max 3 Generierungen/Tag
- Paid-Tier: Alle 3 Modi unbegrenzt
- Zeige Upgrade-CTA wenn Limit erreicht

## Wichtig
- Behalte die gesamte Funktionalität aus prompt-optimizer-tool.jsx bei (alle 3 Modi, alle 7 Kategorien, alle Templates)
- Die Datei hat 1849 Zeilen - teile die Konvertierung in logische Komponenten auf:
  - PromptStudioView.tsx (Haupt-Page mit Layout)
  - src/components/PromptStudio/Generator.tsx
  - src/components/PromptStudio/Optimizer.tsx
  - src/components/PromptStudio/Planner.tsx
  - src/components/PromptStudio/TemplateForm.tsx
  - src/components/PromptStudio/OutputPanel.tsx
  - src/components/PromptStudio/constants.ts (Templates, Kategorien, Patterns)
- Teste dass die App nach der Integration ohne Fehler kompiliert (npm run build)
```

---

**Nutzung:** Kopiere alles zwischen den ``` Markierungen und paste es direkt in Claude Code.
