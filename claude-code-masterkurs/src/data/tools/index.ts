import { toolsAnfaenger } from './toolsAnfaenger';
import { toolsFortgeschritten } from './toolsFortgeschritten';
import { toolsExpert } from './toolsExpert';
import { toolsMcp } from './toolsMcp';
import type { Lesson } from '../../types';

/** First 8 tools (Anfaenger category) are free */
export const FREE_TOOLS_LIMIT = 8;

export const allTools: Lesson[] = [
  ...toolsAnfaenger,
  ...toolsFortgeschritten,
  ...toolsExpert,
  ...toolsMcp,
];

export const toolCategories = [
  { id: 'anfaenger', labelKey: 'tools.catAnfaenger', descKey: 'tools.catAnfaengerDesc', tools: toolsAnfaenger, icon: 'Sparkles' as const },
  { id: 'fortgeschritten', labelKey: 'tools.catFortgeschritten', descKey: 'tools.catFortgeschrittenDesc', tools: toolsFortgeschritten, icon: 'Wrench' as const },
  { id: 'expert', labelKey: 'tools.catExpert', descKey: 'tools.catExpertDesc', tools: toolsExpert, icon: 'Terminal' as const },
  { id: 'mcp', labelKey: 'tools.catMcp', descKey: 'tools.catMcpDesc', tools: toolsMcp, icon: 'Server' as const },
];

export { toolsAnfaenger, toolsFortgeschritten, toolsExpert, toolsMcp };
