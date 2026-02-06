import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import type { TerminalScenario, TerminalStep } from '../../types';

interface Props {
  scenario: TerminalScenario;
  onComplete: (results: { stepId: string; passed: boolean; points: number }[]) => void;
}

interface TerminalLine {
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'success' | 'hint';
  text: string;
}

const SimulatedTerminal = ({ scenario, onComplete }: Props) => {
  const { t } = useTranslation();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [results, setResults] = useState<{ stepId: string; passed: boolean; points: number }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentStep: TerminalStep | undefined = scenario.steps[currentStepIndex];

  // Initialize terminal with welcome message
  useEffect(() => {
    setLines([
      { type: 'system', text: scenario.welcomeMessage },
      { type: 'system', text: '' },
    ]);
    setCurrentStepIndex(0);
    setResults([]);
    setIsComplete(false);
    setShowHint(false);
    setCommandHistory([]);
  }, [scenario]);

  // Show step prompt when step changes
  useEffect(() => {
    if (currentStep && !isComplete) {
      setLines((prev) => [...prev, { type: 'prompt', text: currentStep.prompt }]);
      setShowHint(false);
    }
  }, [currentStepIndex, isComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input
  useEffect(() => {
    if (!isComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [lines, isComplete]);

  // Simulate typing output
  const typeOutput = useCallback(
    (text: string, type: TerminalLine['type']): Promise<void> => {
      return new Promise((resolve) => {
        setIsTyping(true);
        const outputLines = text.split('\n');
        let lineIdx = 0;

        const interval = setInterval(() => {
          if (lineIdx < outputLines.length) {
            setLines((prev) => [...prev, { type, text: outputLines[lineIdx] }]);
            lineIdx++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            resolve();
          }
        }, 60);
      });
    },
    []
  );

  const handleCommand = useCallback(
    async (command: string) => {
      if (!currentStep || isTyping || isComplete) return;

      const trimmed = command.trim();
      if (!trimmed) return;

      // Add input to terminal
      setLines((prev) => [...prev, { type: 'input', text: `$ ${trimmed}` }]);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      setCurrentInput('');

      // Check if command matches
      const normalizedInput = trimmed.toLowerCase().replace(/\s+/g, ' ');
      const isCorrect =
        currentStep.expectedCommands.some(
          (cmd) => normalizedInput === cmd.toLowerCase().replace(/\s+/g, ' ')
        ) ||
        (currentStep.acceptPattern && currentStep.acceptPattern.test(trimmed));

      if (isCorrect) {
        // Correct command
        await typeOutput(currentStep.response, 'success');
        setLines((prev) => [...prev, { type: 'system', text: '' }]);

        const newResults = [
          ...results,
          { stepId: currentStep.id, passed: true, points: currentStep.points },
        ];
        setResults(newResults);

        // Move to next step or finish
        if (currentStepIndex + 1 >= scenario.steps.length) {
          setIsComplete(true);
          setLines((prev) => [
            ...prev,
            { type: 'system', text: '' },
            { type: 'success', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
            { type: 'success', text: '  ✓ ' + t('playground.stepsComplete') },
            {
              type: 'success',
              text: '  ' + t('playground.pointsValue', {
                scored: newResults.reduce((a, r) => a + r.points, 0),
                total: scenario.steps.reduce((a, s) => a + s.points, 0),
              }),
            },
            { type: 'success', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
          ]);
          onComplete(newResults);
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else {
        // Wrong command
        await typeOutput(currentStep.errorResponse, 'error');
        setLines((prev) => [...prev, { type: 'system', text: '' }]);

        // Show hint after wrong attempt
        if (!showHint) {
          setShowHint(true);
          setLines((prev) => [
            ...prev,
            { type: 'hint', text: `💡 ${t('playground.hint')}: ${currentStep.hint}` },
            { type: 'system', text: '' },
          ]);
        }

        // Re-show prompt
        setLines((prev) => [...prev, { type: 'prompt', text: currentStep.prompt }]);
      }
    },
    [currentStep, currentStepIndex, isTyping, isComplete, results, scenario, typeOutput, onComplete, showHint]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleReset = () => {
    setLines([
      { type: 'system', text: scenario.welcomeMessage },
      { type: 'system', text: '' },
    ]);
    setCurrentStepIndex(0);
    setResults([]);
    setIsComplete(false);
    setShowHint(false);
    setCurrentInput('');
    setCommandHistory([]);
    setHistoryIndex(-1);
  };

  // Progress indicator
  const completedSteps = results.filter((r) => r.passed).length;
  const totalSteps = scenario.steps.length;

  return (
    <div className="flex flex-col h-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-apple-elevated/50 border-b border-apple-border">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-apple-error/60" />
            <div className="w-3 h-3 rounded-full bg-apple-warning/60" />
            <div className="w-3 h-3 rounded-full bg-apple-success/60" />
          </div>
          <span className="text-xs text-apple-muted font-mono">
            claude-code — Terminal
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] text-apple-muted font-mono">
            {t('playground.step', {
              current: Math.min(completedSteps + 1, totalSteps),
              total: totalSteps,
            })}
          </span>
          <div className="flex space-x-0.5">
            {scenario.steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx < completedSteps
                    ? 'bg-apple-success'
                    : idx === completedSteps && !isComplete
                    ? 'bg-apple-accent animate-pulse'
                    : 'bg-apple-border'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleReset}
            className="text-[10px] text-apple-muted hover:text-apple-accent font-mono transition-colors"
          >
            {t('playground.reset')}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
        className="flex-1 bg-[#0d1117] p-4 font-mono text-sm overflow-y-auto cursor-text min-h-[350px] max-h-[500px]"
      >
        {/* Terminal Lines */}
        {lines.map((line, idx) => (
          <div key={idx} className="leading-relaxed">
            {line.type === 'system' && (
              <span className="text-[#8b949e]">{line.text}</span>
            )}
            {line.type === 'prompt' && (
              <span className="text-[#58a6ff]">
                {'> '}{line.text}
              </span>
            )}
            {line.type === 'input' && (
              <span className="text-[#f0f6fc]">{line.text}</span>
            )}
            {line.type === 'output' && (
              <span className="text-[#c9d1d9]">{line.text}</span>
            )}
            {line.type === 'success' && (
              <span className="text-[#3fb950]">{line.text}</span>
            )}
            {line.type === 'error' && (
              <span className="text-[#f85149]">{line.text}</span>
            )}
            {line.type === 'hint' && (
              <span className="text-[#d29922]">{line.text}</span>
            )}
            {line.text === '' && <br />}
          </div>
        ))}

        {/* Input Line */}
        {!isComplete && !isTyping && (
          <div className="flex items-center">
            <span className="text-[#3fb950] mr-2">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#f0f6fc] outline-none font-mono text-sm caret-[#ff9500]"
              placeholder="Befehl eingeben..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-pulse" style={{ animationDelay: '0.15s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
        )}
      </div>

      {/* Step Info Footer */}
      <div className="px-4 py-3 bg-apple-elevated/50 border-t border-apple-border">
        {isComplete ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-apple-success" />
              <span className="text-apple-success text-sm font-medium">
                Szenario abgeschlossen!
              </span>
            </div>
            <span className="text-xs font-mono text-apple-accent">
              {results.reduce((a, r) => a + r.points, 0)}/{scenario.steps.reduce((a, s) => a + s.points, 0)} Punkte
            </span>
          </div>
        ) : currentStep ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-apple-muted min-w-0">
              <span className="text-apple-accent font-mono shrink-0">
                [{completedSteps + 1}/{totalSteps}]
              </span>
              <span className="truncate">{currentStep.prompt}</span>
            </div>
            <button
              onClick={() => {
                if (currentStep) {
                  setShowHint(true);
                  setLines((prev) => [
                    ...prev,
                    { type: 'hint', text: `💡 ${currentStep.hint}` },
                    { type: 'system', text: '' },
                  ]);
                }
              }}
              className="flex items-center space-x-1 text-xs text-apple-muted hover:text-apple-info transition-colors shrink-0 ml-3"
            >
              <Lightbulb size={12} />
              <span>Tipp</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SimulatedTerminal;
