import { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Download, Copy, Check, Package } from 'lucide-react';
import type { PlannerFields, ProjectPlan, ProjectComplexity } from '../../types/promptStudio';
import {
  PROJECT_COMPLEXITY,
  analyzeProject,
  generatePhasePrompt,
  generateProjectOverview,
  generateClaudeMdForProject,
  downloadTextFile,
} from './constants';

interface PlannerProps {
  onAnalyzed?: (phases: number, features: number) => void;
  onDownloaded?: (filename: string) => void;
}

const PLANNER_FIELDS = [
  { key: 'name', label: 'Projektname', type: 'text' as const, placeholder: 'z.B. TaskFlow - Projekt-Management App' },
  { key: 'description', label: 'Projekt-Beschreibung', type: 'textarea' as const, placeholder: 'Beschreibe was dein Projekt tut, welches Problem es loest, und wer die Zielgruppe ist.', rows: 6 },
  { key: 'techStack', label: 'Gewuenschter Tech Stack', type: 'text' as const, placeholder: 'z.B. Next.js, TypeScript, Prisma, PostgreSQL, Tailwind CSS' },
  { key: 'features', label: 'Gewuenschte Features (detailliert)', type: 'textarea' as const, placeholder: 'Liste alle Features auf die dein Projekt haben soll:\n\n- User-Authentifizierung\n- Dashboard mit Statistiken\n- Kanban-Board\n- E-Mail-Benachrichtigungen\n- ...', rows: 8 },
  { key: 'targetAudience', label: 'Zielgruppe (optional)', type: 'text' as const, placeholder: 'z.B. Freelancer und kleine Teams (2-10 Personen)' },
];

const PLANNER_TIPS = [
  'Je detaillierter die Feature-Beschreibung, desto besser die Prompts',
  'Nenne konkrete Tools/Libraries die du verwenden willst',
  'Beschreibe auch nicht-funktionale Anforderungen (Performance, SEO, etc.)',
  'Erwaehne externe Services (Stripe, SendGrid, S3, etc.)',
  "Bei grossen Projekten: 'Gross' waehlen fuer mehr Phasen und granulare Prompts",
];

const Planner = ({ onAnalyzed, onDownloaded }: PlannerProps) => {
  const [plannerFields, setPlannerFields] = useState<PlannerFields>({});
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [activePhaseTab, setActivePhaseTab] = useState<string | null>(null);
  const [plannerStep, setPlannerStep] = useState<'input' | 'plan'>('input');
  const [copied, setCopied] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);

  const handlePlannerFieldChange = useCallback((key: string, value: string) => {
    setPlannerFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAnalyzeProject = useCallback(() => {
    const plan = analyzeProject(plannerFields);
    setProjectPlan(plan);
    setActivePhaseTab(plan.phases[0]?.id || null);
    setPlannerStep('plan');
    onAnalyzed?.(plan.phases.length, plan.detectedFeatureCount);
    setTimeout(() => plannerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [plannerFields, onAnalyzed]);

  const handleDownloadPhase = useCallback((phase: ProjectPlan['phases'][0]) => {
    if (!projectPlan) return;
    const content = generatePhasePrompt(phase, projectPlan);
    const filename = `phase-${phase.number}-${phase.category}.md`;
    downloadTextFile(filename, content);
    onDownloaded?.(filename);
  }, [projectPlan, onDownloaded]);

  const handleDownloadAll = useCallback(() => {
    if (!projectPlan) return;
    const overviewFilename = `00-uebersicht-${projectPlan.projectName.toLowerCase().replace(/\s+/g, '-')}.md`;
    downloadTextFile(overviewFilename, generateProjectOverview(projectPlan));
    setTimeout(() => downloadTextFile('CLAUDE.md', generateClaudeMdForProject(projectPlan)), 200);
    projectPlan.phases.forEach((phase, i) => {
      setTimeout(() => {
        downloadTextFile(`phase-${phase.number}-${phase.category}.md`, generatePhasePrompt(phase, projectPlan));
      }, 400 + i * 200);
    });
    onDownloaded?.('all-files.zip');
  }, [projectPlan, onDownloaded]);

  const handleBackToInput = useCallback(() => {
    setPlannerStep('input');
    setProjectPlan(null);
  }, []);

  const handleCopyPhase = useCallback((phase: ProjectPlan['phases'][0]) => {
    if (!projectPlan) return;
    navigator.clipboard.writeText(generatePhasePrompt(phase, projectPlan));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [projectPlan]);

  // ─── INPUT STEP ───
  if (plannerStep === 'input') {
    return (
      <div>
        <div className="apple-card mb-5">
          <h2 className="text-xs font-semibold text-apple-muted uppercase tracking-wider font-mono mb-1">
            Projekt beschreiben
          </h2>
          <p className="text-xs text-apple-muted mb-5">
            Beschreibe dein Projekt so detailliert wie moeglich. Die KI erkennt automatisch Features und erstellt einen Implementierungsplan.
          </p>

          <div className="flex flex-col gap-4">
            {PLANNER_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5 text-apple-text">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={(plannerFields as Record<string, string>)[field.key] || ''}
                    onChange={(e) => handlePlannerFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    className="w-full px-3 py-2.5 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono resize-y outline-none focus:border-violet-500/50 transition-colors placeholder:text-apple-muted/50 leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    value={(plannerFields as Record<string, string>)[field.key] || ''}
                    onChange={(e) => handlePlannerFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono outline-none focus:border-violet-500/50 transition-colors placeholder:text-apple-muted/50"
                  />
                )}
              </div>
            ))}

            {/* Complexity Selector */}
            <div>
              <label className="block text-sm font-medium mb-2 text-apple-text">
                Projekt-Komplexitaet
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(PROJECT_COMPLEXITY) as [ProjectComplexity, typeof PROJECT_COMPLEXITY.small][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handlePlannerFieldChange('complexity', key)}
                    className={`p-3 rounded-apple text-left transition-all ${
                      (plannerFields.complexity || 'medium') === key
                        ? 'bg-violet-500/10 border border-violet-500 text-violet-400'
                        : 'bg-apple-bg border border-apple-border text-apple-muted hover:border-apple-borderLight'
                    }`}
                  >
                    <div className="text-sm font-semibold">{val.label}</div>
                    <div className="text-[11px] mt-1 text-apple-muted">{val.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyzeProject}
            disabled={!plannerFields.description}
            className={`mt-5 w-full py-3.5 px-6 rounded-apple font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              plannerFields.description
                ? 'bg-violet-500 hover:bg-violet-600 text-white cursor-pointer'
                : 'bg-apple-border text-apple-muted cursor-not-allowed'
            }`}
          >
            Projekt analysieren & Plan erstellen
          </button>
        </div>

        {/* Tips */}
        <div className="rounded-apple-lg border border-violet-500/20 bg-violet-500/5 p-5">
          <h3 className="text-sm font-semibold mb-3 text-violet-400">
            Tipps fuer bessere Ergebnisse
          </h3>
          {PLANNER_TIPS.map((tip, i) => (
            <div key={i} className="text-xs text-apple-textSecondary pl-3 border-l-2 border-violet-500/30 mb-2 last:mb-0">
              {tip}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── PLAN VIEW ───
  if (!projectPlan) return null;

  return (
    <div ref={plannerRef}>
      {/* Plan Overview Card */}
      <div className="rounded-apple-lg bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-violet-500/25 p-6 mb-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-apple-text">{projectPlan.projectName}</h2>
            <p className="text-sm text-apple-textSecondary mt-1">
              {projectPlan.description.slice(0, 120)}{projectPlan.description.length > 120 ? '...' : ''}
            </p>
          </div>
          <button
            onClick={handleBackToInput}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-apple-bg border border-apple-border rounded-apple text-apple-muted text-xs font-mono hover:text-apple-text transition-colors"
          >
            <ArrowLeft size={12} />
            Zurueck
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Phasen', value: projectPlan.phases.length, color: 'text-violet-400' },
            { label: 'Prompts gesamt', value: projectPlan.totalPrompts, color: 'text-blue-400' },
            { label: 'Features erkannt', value: projectPlan.detectedFeatureCount, color: 'text-emerald-400' },
            { label: 'Dateien', value: projectPlan.needsMultipleFiles ? `${projectPlan.phases.length + 2} .md` : '1 Prompt', color: 'text-apple-warning' },
          ].map((stat, i) => (
            <div key={i} className="bg-apple-surface rounded-apple p-3 border border-apple-border">
              <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[11px] text-apple-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Download All Button */}
      <div className="apple-card mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-apple-text">Alle Dateien herunterladen</div>
          <div className="text-xs text-apple-muted mt-0.5">
            Uebersicht + CLAUDE.md + {projectPlan.phases.length} Phase-Prompts als .md Dateien
          </div>
        </div>
        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-apple text-sm font-semibold transition-colors shrink-0"
        >
          <Package size={14} />
          Alle herunterladen ({projectPlan.phases.length + 2} Dateien)
        </button>
      </div>

      {/* Phase Tabs */}
      <div className="flex gap-1 overflow-x-auto mb-1 pb-2">
        {projectPlan.phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhaseTab(phase.id)}
            className={`px-3 py-2 rounded-t-apple text-xs font-mono whitespace-nowrap shrink-0 transition-all border-b-2 ${
              activePhaseTab === phase.id
                ? 'bg-apple-surface border-violet-500 text-violet-400 font-semibold border border-apple-border border-b-violet-500'
                : 'border-transparent text-apple-muted hover:text-apple-textSecondary'
            }`}
          >
            Phase {phase.number}
          </button>
        ))}
      </div>

      {/* Active Phase Detail */}
      {projectPlan.phases
        .filter((p) => p.id === activePhaseTab)
        .map((phase) => (
          <div key={phase.id} className="apple-card !rounded-tl-none overflow-hidden !p-0">
            {/* Phase Header */}
            <div className="px-5 py-4 border-b border-apple-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-apple-text">
                  Phase {phase.number}: {phase.title}
                </h3>
                <p className="text-xs text-apple-muted mt-1">
                  {phase.description}
                  {phase.dependencies.length > 0 && (
                    <span className="text-apple-warning ml-2">
                      Abhaengig von: {phase.dependencies.map((d) => {
                        const dep = projectPlan.phases.find((p) => p.id === d);
                        return dep ? `Phase ${dep.number}` : '';
                      }).filter(Boolean).join(', ')}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleDownloadPhase(phase)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 text-violet-400 border border-violet-500/30 rounded-apple text-xs font-semibold font-mono hover:bg-violet-500/20 transition-colors shrink-0"
              >
                <Download size={12} />
                phase-{phase.number}.md
              </button>
            </div>

            {/* Tasks */}
            <div className="px-5 py-4 border-b border-apple-border">
              <h4 className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider font-mono mb-3">
                Aufgaben in dieser Phase
              </h4>
              <div className="flex flex-col gap-1.5">
                {phase.tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-apple bg-apple-bg text-sm">
                    <span className="text-violet-400 font-semibold font-mono shrink-0">{i + 1}.</span>
                    <span className="text-apple-text">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Preview */}
            <div className="px-5 py-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider font-mono">
                  Prompt-Vorschau
                </h4>
                <button
                  onClick={() => handleCopyPhase(phase)}
                  className={`flex items-center gap-1.5 px-3 py-1 border rounded-apple text-xs font-mono transition-all ${
                    copied
                      ? 'bg-apple-success border-apple-success text-white'
                      : 'bg-apple-bg border-apple-border text-apple-muted hover:text-apple-text'
                  }`}
                >
                  {copied ? <Check size={11} /> : <Copy size={11} />}
                  {copied ? 'Kopiert!' : 'Kopieren'}
                </button>
              </div>
              <pre className="p-4 bg-apple-bg rounded-apple border border-apple-border text-xs leading-relaxed text-apple-text overflow-auto max-h-[400px] whitespace-pre-wrap break-words font-mono">
                {generatePhasePrompt(phase, projectPlan)}
              </pre>
            </div>
          </div>
        ))}

      {/* Implementation Order */}
      <div className="apple-card mt-5">
        <h3 className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider font-mono mb-4">
          Implementierungs-Reihenfolge
        </h3>
        <div className="flex flex-col gap-2">
          {projectPlan.phases.map((phase) => (
            <div
              key={phase.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActivePhaseTab(phase.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                activePhaseTab === phase.id
                  ? 'bg-violet-500 text-white'
                  : 'bg-apple-bg border-2 border-apple-border text-apple-muted group-hover:border-violet-500/50'
              }`}>
                {phase.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm transition-colors ${
                  activePhaseTab === phase.id ? 'text-violet-400 font-semibold' : 'text-apple-text group-hover:text-violet-400'
                }`}>
                  {phase.title}
                </div>
                <div className="text-[11px] text-apple-muted">
                  {phase.tasks.length} Aufgaben &middot; ~{phase.estimatedPrompts} Prompt{phase.estimatedPrompts !== 1 ? 's' : ''}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownloadPhase(phase); }}
                className="px-2 py-1 bg-transparent border border-apple-border rounded text-apple-muted text-[11px] font-mono hover:border-violet-500/50 hover:text-violet-400 transition-colors shrink-0"
              >
                <Download size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planner;
