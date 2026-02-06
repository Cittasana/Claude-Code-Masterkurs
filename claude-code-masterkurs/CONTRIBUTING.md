# 🤝 Contributing Guide

## Branch-Strategie & Deployment

- **`main`** – Production. Jeder Push auf `main` wird von Vercel automatisch gebaut und unter https://claude-code-masterkurs.de deployed. Nur mergen, wenn die Änderung live gehen soll.
- **`develop`** (optional) – Feature-Branch für laufende Arbeit. Von `develop` aus arbeiten, wenn fertig nach `main` mergen → löst Deploy aus.

**Workflow (mit develop):**
```bash
git checkout develop    # oder: git checkout -b develop  (einmalig anlegen)
# ... Änderungen ...
git add . && git commit -m "Feature: ..."
git push origin develop
# Wenn bereit für Release: Merge in main (lokal oder per Pull Request auf GitHub)
git checkout main && git merge develop && git push origin main
```

**Workflow (nur main):** Direkt auf `main` committen und pushen → sofortiger Deploy.

---

## Neue Lektionen hinzufügen

### 1. Lektion-Daten erstellen

Öffne `src/data/lessons.ts` und füge eine neue Lektion hinzu:

```typescript
{
  id: 3,  // Fortlaufende ID
  level: 1,  // 1 = Grundlagen, 2 = Fortgeschritten, 3 = Expert
  title: 'Deine Lektion Title',
  description: 'Kurze Beschreibung (1-2 Sätze)',
  duration: '20 Minuten',  // Geschätzte Dauer
  objectives: [
    'Lernziel 1',
    'Lernziel 2',
    'Lernziel 3',
  ],
  content: [
    // Content Blocks (siehe unten)
  ]
}
```

### 2. Content Blocks

#### Heading (Überschrift)
```typescript
{
  type: 'heading',
  content: '🎯 Meine Überschrift'
}
```

#### Text (Fließtext)
```typescript
{
  type: 'text',
  content: 'Dein Text hier. Kann auch Zeilenumbrüche enthalten.'
}
```

#### List (Aufzählung)
```typescript
{
  type: 'list',
  content: `- Punkt 1
- Punkt 2
- **Fett**: Mit Beschreibung
- Punkt 3`
}
```

#### Code Block
```typescript
{
  type: 'code',
  language: 'bash',  // bash, typescript, javascript, yaml, json, etc.
  content: `# Dein Code hier
npm install package
echo "Hello World"`
}
```

#### Highlight Box (Wichtige Hinweise)
```typescript
{
  type: 'highlight',
  title: '💡 Wichtig',  // Optional
  content: 'Wichtiger Hinweis oder Tipp für den Nutzer.'
}
```

### 3. Quiz erstellen

Öffne `src/data/quizzes.ts` und füge ein Quiz hinzu:

```typescript
{
  id: 'l3-quiz-1',  // Eindeutige ID (l[LektionID]-quiz-[Number])
  lessonId: 3,  // Muss mit Lektion ID übereinstimmen
  title: 'Quiz Titel',
  type: 'multiple-choice',  // oder 'checklist', 'true-false'
  points: 5,  // Punkte für dieses Quiz
  passingScore: 60,  // Mindest-Prozent zum Bestehen
  maxAttempts: 3,  // Maximale Versuche
  questions: [
    {
      id: 'l3-q1',  // Eindeutige Question ID
      text: 'Deine Frage?',
      type: 'radio',  // 'radio' für Multiple Choice, 'checkbox' für Checklist
      options: [
        {
          id: 'a',
          label: 'Antwort A',
          value: 'answer-a',
        },
        {
          id: 'b',
          label: 'Richtige Antwort',
          value: 'answer-b',
          isCorrect: true  // Markiert richtige Antwort
        },
        {
          id: 'c',
          label: 'Antwort C',
          value: 'answer-c',
        }
      ],
      correctAnswer: 'b',  // ID der richtigen Antwort
      explanation: 'Erklärung warum diese Antwort richtig ist.',
      hints: [
        'Erster Hinweis (wird bei Bedarf angezeigt)',
        'Zweiter Hinweis',
        'Dritter Hinweis'
      ]
    }
  ]
}
```

### 4. Checklist Quiz (für Installations-Verifikation)

```typescript
{
  id: 'l3-quiz-1',
  lessonId: 3,
  title: 'Installations-Check',
  type: 'checklist',
  points: 8,
  passingScore: 75,
  maxAttempts: 3,
  questions: [
    {
      id: 'l3-q1',
      text: 'Hast du die Software installiert?',
      type: 'checkbox',
      explanation: 'Die Software muss installiert sein um fortzufahren.',
      hints: [
        'Führe npm install aus',
        'Prüfe mit --version'
      ]
    },
    // Weitere Checkbox-Fragen...
  ]
}
```

## Projekt hinzufügen

### 1. Projekt-Daten erstellen

Erstelle `src/data/projects.ts` (falls noch nicht vorhanden):

```typescript
import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'proj-1-1',
    level: 1,
    title: 'Mein erstes Projekt',
    description: 'Detaillierte Projektbeschreibung',
    difficulty: 'Anfänger',
    duration: '2-3 Stunden',
    requirements: [
      'Anforderung 1',
      'Anforderung 2',
      'Anforderung 3'
    ],
    starterCode: `// Optional: Starter Code
function hello() {
  console.log("Hello World");
}`,
    hints: [
      'Hinweis 1',
      'Hinweis 2',
      'Hinweis 3'
    ],
    solution: `// Optional: Lösung
// Vollständiger Lösungs-Code`,
    validation: {
      tests: [
        {
          name: 'test-1',
          description: 'Prüft Feature 1',
          check: () => {
            // Validierungs-Logic
            return true;
          },
          points: 20
        }
      ],
      minScore: 80
    },
    resources: [
      'https://link-to-resource-1.com',
      'https://link-to-resource-2.com'
    ]
  }
];
```

### 2. ProjectView implementieren

Update `src/pages/ProjectView.tsx` um Projekte anzuzeigen.

## Best Practices

### Content Writing
- **Klarheit**: Kurze, präzise Sätze
- **Struktur**: Nutze Headings zur Gliederung
- **Beispiele**: Zeige praktische Code-Beispiele
- **Highlights**: Nutze Highlight Boxes für wichtige Infos
- **Konsistenz**: Halte Format und Stil konsistent

### Code-Beispiele
- **Kommentiert**: Füge hilfreiche Kommentare hinzu
- **Lauffähig**: Code sollte copy-paste-bar sein
- **Relevant**: Zeige realistische Anwendungsfälle
- **Vollständig**: Keine unvollständigen Snippets

### Quiz-Design
- **Fair**: Fragen sollten aus Lektion beantwortbar sein
- **Klar**: Eindeutige Fragestellungen
- **Lehrreich**: Explanations sollten weiteren Kontext geben
- **Progressiv**: Hints vom leichtesten zum spezifischsten

## Code Style

### TypeScript
- Nutze TypeScript Types für alles
- Keine `any` Types
- Interfaces für komplexe Typen

### React Components
```typescript
// Functional Components mit TypeScript
interface Props {
  title: string;
  onAction: () => void;
}

const MyComponent = ({ title, onAction }: Props) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

### CSS (Tailwind)
- Nutze Tailwind utility classes
- Erstelle custom classes in `index.css` für wiederverwendbare Styles
- Nutze die definierten github-* Farben

## Testing

### Manuelles Testing
1. Starte Dev Server: `npm run dev`
2. Navigiere durch neue Lektion
3. Teste Quiz Funktionalität
4. Prüfe Code Copy Funktionen
5. Teste auf verschiedenen Bildschirmgrößen

### Build Testing
```bash
npm run build
npm run preview
```

## Commit Messages

Nutze klare Commit Messages:
```
feat: Add Lesson 3 - First Steps & Commands
fix: Quiz validation for checklist questions
docs: Update CONTRIBUTING guide
style: Improve code formatting in LessonContent
refactor: Simplify quiz scoring logic
```

## Pull Request

1. Fork das Repository
2. Erstelle Feature Branch: `git checkout -b feature/lesson-3`
3. Committe Änderungen: `git commit -m "feat: Add Lesson 3"`
4. Push Branch: `git push origin feature/lesson-3`
5. Erstelle Pull Request

### PR Checklist
- [ ] Code ist getestet
- [ ] Keine TypeScript Errors
- [ ] README aktualisiert (falls nötig)
- [ ] Content ist vollständig
- [ ] Quiz ist funktional

## Fragen?

Bei Fragen erstelle ein Issue im Repository!

Danke für deinen Beitrag! 🙏
