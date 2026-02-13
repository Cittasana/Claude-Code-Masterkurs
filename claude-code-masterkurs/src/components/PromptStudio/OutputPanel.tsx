import { useState, useCallback } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import type { AnalysisResult } from '../../types/promptStudio';

interface OutputPanelProps {
  output: string;
  analysis: AnalysisResult | null;
  mode: 'generate' | 'optimize';
  onDownload?: (filename: string, content: string) => void;
}

const OutputPanel = ({ output, analysis, mode, onDownload }: OutputPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-5">
      {/* Analysis Results */}
      {analysis && (
        <div className="apple-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-apple-muted uppercase tracking-wider font-mono">
              Analyse
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${
              analysis.score >= 80
                ? 'bg-apple-success/10 text-apple-success border-apple-success/30'
                : analysis.score >= 50
                ? 'bg-apple-warning/10 text-apple-warning border-apple-warning/30'
                : 'bg-apple-error/10 text-apple-error border-apple-error/30'
            }`}>
              Score: {analysis.score}%
            </div>
          </div>

          {/* Score Bar */}
          <div className="h-1.5 bg-apple-bg rounded-full mb-5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analysis.score >= 80
                  ? 'bg-apple-success'
                  : analysis.score >= 50
                  ? 'bg-apple-warning'
                  : 'bg-apple-error'
              }`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>

          {/* Checklist */}
          <div className="grid gap-1.5 mb-4">
            {analysis.results.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2 rounded-apple text-sm ${
                  r.passed
                    ? 'bg-apple-success/10 text-apple-success'
                    : 'bg-apple-error/10 text-apple-error'
                }`}
              >
                <span className="text-sm">{r.passed ? '\u2705' : '\u274C'}</span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="border-t border-apple-border pt-4">
              <h3 className="text-sm font-semibold mb-2.5 text-apple-warning">
                Verbesserungsvorschlaege
              </h3>
              {analysis.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="text-xs text-apple-textSecondary py-1.5 border-b border-apple-border/50 last:border-0"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="apple-card overflow-hidden !p-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-apple-border bg-blue-500/5">
            <h2 className="text-xs font-semibold text-apple-muted uppercase tracking-wider font-mono">
              {mode === 'generate' ? 'Generierter Output' : 'Optimierter Output'}
            </h2>
            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload('prompt-output.md', output)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-apple-bg border border-apple-border rounded-apple text-apple-muted text-xs font-mono hover:text-apple-text hover:border-apple-accent/50 transition-colors"
                >
                  <Download size={12} />
                  .md
                </button>
              )}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-apple text-xs font-mono transition-all ${
                  copied
                    ? 'bg-apple-success border-apple-success text-white'
                    : 'bg-apple-bg border-apple-border text-apple-muted hover:text-apple-text hover:border-apple-accent/50'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
            </div>
          </div>
          <pre className="p-5 text-sm leading-relaxed text-apple-text overflow-auto max-h-[600px] whitespace-pre-wrap break-words font-mono">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OutputPanel;
