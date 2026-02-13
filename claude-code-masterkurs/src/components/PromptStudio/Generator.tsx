import { useState, useCallback, useRef } from 'react';
import { Zap } from 'lucide-react';
import type { PromptCategoryId, PromptCategory, AnalysisResult } from '../../types/promptStudio';
import { TEMPLATES, GENERATORS, analyzePrompt } from './constants';
import TemplateForm from './TemplateForm';
import OutputPanel from './OutputPanel';

interface GeneratorProps {
  activeCategory: PromptCategoryId;
  category: PromptCategory;
  onGenerated?: () => void;
}

const Generator = ({ activeCategory, category, onGenerated }: GeneratorProps) => {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const template = TEMPLATES[activeCategory];

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    const gen = GENERATORS[activeCategory];
    if (gen) {
      const result = gen(fields);
      setOutput(result);
      setAnalysis(analyzePrompt(activeCategory, result));
      onGenerated?.();
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [activeCategory, fields, onGenerated]);

  // Reset when category changes
  const [lastCategory, setLastCategory] = useState(activeCategory);
  if (activeCategory !== lastCategory) {
    setLastCategory(activeCategory);
    setFields({});
    setOutput('');
    setAnalysis(null);
  }

  return (
    <div>
      {/* Configuration Form */}
      <div className="apple-card mb-5">
        <h2 className="text-xs font-semibold text-apple-muted uppercase tracking-wider font-mono mb-4">
          Konfiguration
        </h2>
        <TemplateForm fields={template.fields} values={fields} onChange={handleFieldChange} />
        <button
          onClick={handleGenerate}
          className="mt-5 w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-apple font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          Generieren
        </button>
      </div>

      {/* Tips */}
      <div className="rounded-apple-lg border border-blue-500/20 bg-blue-500/5 p-5 mb-5">
        <h3 className="text-sm font-semibold mb-3 text-blue-400">
          Best Practices fuer {category.label}
        </h3>
        <div className="flex flex-col gap-2">
          {template.tips.map((tip, i) => (
            <div
              key={i}
              className="text-xs text-apple-textSecondary pl-3 border-l-2 border-blue-500/30"
            >
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div ref={outputRef}>
        <OutputPanel output={output} analysis={analysis} mode="generate" />
      </div>
    </div>
  );
};

export default Generator;
