/**
 * Mapping von Kategorienamen (aus challenges.ts / liveCodingChallenges.ts)
 * auf i18n-Keys unter challenges.categories.*
 */
export const CATEGORY_TO_I18N_KEY: Record<string, string> = {
  'CLAUDE.md': 'claudeMd',
  'CLI Befehle': 'cliCommands',
  'Prompt Engineering': 'promptEngineering',
  'MCP Konfiguration': 'mcpConfig',
  'Hooks & Automation': 'hooksAutomation',
  'Agent Design': 'agentDesign',
  'Algorithmen': 'algorithms',
  'Datenstrukturen': 'dataStructures',
  'Rekursion & DP': 'recursionDp',
  'Strings & Arrays': 'stringsArrays',
  'Graphen & BFS/DFS': 'graphsBfsDfs',
};

export function getCategoryI18nKey(category: string): string {
  return CATEGORY_TO_I18N_KEY[category] ?? category.replace(/\s+/g, '_').replace(/[&.]/g, '');
}
