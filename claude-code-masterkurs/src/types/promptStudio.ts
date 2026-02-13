// ─── Prompt Studio Types ───────────────────────────────────────────────────

export type PromptCategoryId =
  | 'claude-md'
  | 'build-prompts'
  | 'skills'
  | 'tools'
  | 'hooks'
  | 'mcps'
  | 'agents';

export interface PromptCategory {
  id: PromptCategoryId;
  label: string;
  icon: string;
  desc: string;
}

export type FieldType = 'text' | 'textarea' | 'select';

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  rows?: number;
}

export interface AnalyzeCheck {
  label: string;
  check: (text: string) => boolean;
}

export interface PromptTemplate {
  fields: TemplateField[];
  tips: string[];
  analyzeChecks: AnalyzeCheck[];
}

export interface AnalysisCheckResult {
  label: string;
  passed: boolean;
}

export interface AnalysisResult {
  results: AnalysisCheckResult[];
  score: number;
  suggestions: string[];
  lines: number;
}

export type ProjectComplexity = 'small' | 'medium' | 'large';

export interface ComplexityConfig {
  maxPhases: number;
  label: string;
  desc: string;
  promptLimit: number;
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  tasks: string[];
  estimatedPrompts: number;
  dependencies: string[];
}

export interface ProjectPlan {
  projectName: string;
  techStack: string;
  description: string;
  features: string;
  targetAudience: string;
  complexity: ProjectComplexity;
  phases: Phase[];
  totalPrompts: number;
  needsMultipleFiles: boolean;
  detectedFeatureCount: number;
}

export interface PlannerFields {
  name?: string;
  description?: string;
  techStack?: string;
  features?: string;
  targetAudience?: string;
  complexity?: ProjectComplexity;
}

export type StudioMode = 'generate' | 'optimize' | 'planner';
