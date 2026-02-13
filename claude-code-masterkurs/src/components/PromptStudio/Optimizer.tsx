import { useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';
import type { PromptCategoryId, PromptCategory, AnalysisResult } from '../../types/promptStudio';
import { TEMPLATES, analyzePrompt, optimizePrompt } from './constants';
import OutputPanel from './OutputPanel';

interface OptimizerProps {
  activeCategory: PromptCategoryId;
  category: PromptCategory;
  onOptimized?: (score: number) => void;
}

const Optimizer = ({ activeCategory, category, onOptimized }: OptimizerProps) => {
  const [optimizeInput, setOptimizeInput] = useState('');
  const [output, setOutput] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const template = TEMPLATES[activeCategory];

  const handleOptimize = useCallback(() => {
    if (!optimizeInput.trim()) return;
    const result = analyzePrompt(activeCategory, optimizeInput);
    setAnalysis(result);
    const optimized = optimizePrompt(activeCategory, optimizeInput);
    setOutput(optimized);
    if (result) onOptimized?.(result.score);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [activeCategory, optimizeInput, onOptimized]);

  // Reset when category changes
  const [lastCategory, setLastCategory] = useState(activeCategory);
  if (activeCategory !== lastCategory) {
    setLastCategory(activeCategory);
    setOptimizeInput('');
    setOutput('');
    setAnalysis(null);
  }

  return (
    <div>
      {/* Input */}
      <div className="apple-card mb-5">
        <h2 className="text-xs font-semibold text-apple-muted uppercase tracking-wider font-mono mb-4">
          Bestehenden Prompt einfuegen
        </h2>
        <textarea
          value={optimizeInput}
          onChange={(e) => setOptimizeInput(e.target.value)}
          placeholder={`Fuege hier deinen bestehenden ${category.label} Prompt/Config ein...`}
          rows={12}
          className="w-full px-4 py-3 bg-apple-bg border border-apple-border rounded-apple text-apple-text text-sm font-mono resize-y outline-none focus:border-emerald-500/50 transition-colors placeholder:text-apple-muted/50 leading-relaxed"
        />
        <button
          onClick={handleOptimize}
          className="mt-4 w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-apple font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Search size={16} />
          Analysieren & Optimieren
        </button>
      </div>

      {/* Tips */}
      <div className="rounded-apple-lg border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
        <h3 className="text-sm font-semibold mb-3 text-emerald-400">
          Best Practices fuer {category.label}
        </h3>
        <div className="flex flex-col gap-2">
          {template.tips.map((tip, i) => (
            <div
              key={i}
              className="text-xs text-apple-textSecondary pl-3 border-l-2 border-emerald-500/30"
            >
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div ref={outputRef}>
        <OutputPanel output={output} analysis={analysis} mode="optimize" />
      </div>
    </div>
  );
};

export default Optimizer;
