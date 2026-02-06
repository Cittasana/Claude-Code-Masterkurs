/**
 * Live Coding Challenges – Algorithmen & Datenstrukturen
 * Separat von den Projekten und den Claude-Code-Challenges.
 * Enthält bewusst harte Nüsse (Sliding Window, DP, Graphen).
 */
import type { CodingChallenge } from '../types';

export const liveCodingChallenges: CodingChallenge[] = [
  // ─── Anfänger ─────────────────────────────────────────
  {
    id: 'live-01',
    source: 'live-coding',
    title: 'Two Sum',
    description: 'Finde zwei Indizes, deren Werte sich zu target summieren. Klassiker mit HashMap.',
    category: 'Algorithmen',
    difficulty: 'Anfänger',
    timeLimit: 300,
    points: 80,
    instruction: `Implementiere die Funktion twoSum(nums: number[], target: number): number[].
- Gib die beiden Indizes i, j zurück, für die nums[i] + nums[j] === target.
- Es gibt genau eine Lösung; nutze eine Map (oder Objekt) für O(n) Lookup.
- Beispiel: twoSum([2, 7, 11, 15], 9) → [0, 1]`,
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Dein Code hier
  return [];
}
`,
    language: 'typescript',
    hints: [
      'Speichere für jede Zahl den Index in einer Map: value → index.',
      'Für jedes nums[i] prüfe, ob (target - nums[i]) bereits in der Map steht.',
      'Wenn ja, gib [map.get(target - nums[i]), i] zurück.',
    ],
    validations: [
      {
        id: 'live-01-1',
        name: 'Funktion twoSum vorhanden',
        pattern: 'twoSum\\s*\\(|function twoSum',
        isRegex: true,
        errorMessage: 'Die Funktion muss "twoSum" heißen.',
        points: 15,
      },
      {
        id: 'live-01-2',
        name: 'Map oder Objekt für Lookup',
        pattern: 'Map|new Map|\\{\\s*\\}|Record|object',
        isRegex: true,
        errorMessage: 'Nutze eine Map oder ein Objekt für O(1)-Lookup.',
        points: 35,
      },
      {
        id: 'live-01-3',
        name: 'Return Array mit zwei Indizes',
        pattern: 'return\\s*\\[.*,.*\\]',
        isRegex: true,
        errorMessage: 'Gib ein Array mit genau zwei Indizes zurück.',
        points: 30,
      },
    ],
    solution: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement)!, i];
    map.set(nums[i], i);
  }
  return [];
}
`,
  },
  {
    id: 'live-02',
    source: 'live-coding',
    title: 'Palindrome Check',
    description: 'Prüfe, ob ein String vorwärts und rückwärts gelesen gleich ist.',
    category: 'Strings & Arrays',
    difficulty: 'Anfänger',
    timeLimit: 180,
    points: 60,
    instruction: `Implementiere isPalindrome(s: string): boolean.
- Ignoriere Nicht-Buchstaben/Ziffern und Groß-/Kleinschreibung.
- Beispiele: "A man a plan a canal: Panama" → true, "race a car" → false.`,
    starterCode: `function isPalindrome(s: string): boolean {
  return false;
}
`,
    language: 'typescript',
    hints: [
      'Bereinige den String: nur alphanumerische Zeichen, toLowerCase.',
      'Vergleiche mit Two-Pointer: links und rechts zur Mitte.',
    ],
    validations: [
      {
        id: 'live-02-1',
        name: 'Funktion isPalindrome',
        pattern: 'isPalindrome',
        isRegex: false,
        errorMessage: 'Die Funktion muss isPalindrome heißen.',
        points: 20,
      },
      {
        id: 'live-02-2',
        name: 'Vergleich/Verknüpfung beider Enden',
        pattern: 'left|right|start|end|charAt|\\[.*\\]|replace|toLowerCase',
        isRegex: true,
        errorMessage: 'Vergleiche Zeichen von beiden Enden (Two Pointer oder bereinigter String).',
        points: 40,
      },
    ],
    solution: `function isPalindrome(s: string): boolean {
  const cleaned = s.replace(/[^a-z0-9]/gi, '').toLowerCase();
  let left = 0, right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++; right--;
  }
  return true;
}
`,
  },
  {
    id: 'live-03',
    source: 'live-coding',
    title: 'FizzBuzz',
    description: 'Klassisches FizzBuzz: durch 3 → Fizz, durch 5 → Buzz, durch beide → FizzBuzz.',
    category: 'Algorithmen',
    difficulty: 'Anfänger',
    timeLimit: 120,
    points: 50,
    instruction: `Implementiere fizzBuzz(n: number): string[].
- Gib ein Array der Länge n zurück: für i (1-basiert) "Fizz" wenn durch 3, "Buzz" wenn durch 5, "FizzBuzz" wenn durch 15, sonst String(i).`,
    starterCode: `function fizzBuzz(n: number): string[] {
  const out: string[] = [];
  // Dein Code
  return out;
}
`,
    language: 'typescript',
    hints: [
      'Loop von 1 bis n, für jede Zahl die Bedingungen prüfen.',
      'Zuerst auf Teilbarkeit durch 15 prüfen, dann 3, dann 5.',
    ],
    validations: [
      {
        id: 'live-03-1',
        name: 'FizzBuzz im Code',
        pattern: 'FizzBuzz|Fizz.*Buzz',
        isRegex: true,
        errorMessage: 'FizzBuzz muss für durch 15 teilbare Zahlen vorkommen.',
        points: 25,
      },
      {
        id: 'live-03-2',
        name: 'Return Array',
        pattern: 'return.*\\[|push\\(|out\\.push',
        isRegex: true,
        errorMessage: 'Gib ein Array zurück.',
        points: 25,
      },
    ],
    solution: `function fizzBuzz(n: number): string[] {
  const out: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push('FizzBuzz');
    else if (i % 3 === 0) out.push('Fizz');
    else if (i % 5 === 0) out.push('Buzz');
    else out.push(String(i));
  }
  return out;
}
`,
  },

  // ─── Fortgeschritten ──────────────────────────────────
  {
    id: 'live-04',
    source: 'live-coding',
    title: 'Longest Substring Without Repeating',
    description: 'Länge des längsten Teilstrings ohne wiederholte Zeichen – Sliding Window.',
    category: 'Strings & Arrays',
    difficulty: 'Fortgeschritten',
    timeLimit: 480,
    points: 150,
    instruction: `Implementiere lengthOfLongestSubstring(s: string): number.
- Finde die Länge des längsten Teilstrings ohne wiederholtes Zeichen.
- Beispiel: "abcabcbb" → 3 ("abc"), "pwwkew" → 3 ("wke").`,
    starterCode: `function lengthOfLongestSubstring(s: string): number {
  let max = 0;
  // Sliding Window: Set oder Map für Zeichen im aktuellen Fenster
  return max;
}
`,
    language: 'typescript',
    hints: [
      'Sliding Window: zwei Pointer left/right; Set für Zeichen im Fenster.',
      'Wenn s[right] schon im Set: left verschieben und Zeichen aus Set entfernen.',
      'Bei jedem Schritt max = Math.max(max, right - left + 1).',
    ],
    validations: [
      {
        id: 'live-04-1',
        name: 'Funktion lengthOfLongestSubstring',
        pattern: 'lengthOfLongestSubstring',
        isRegex: false,
        errorMessage: 'Die Funktion muss lengthOfLongestSubstring heißen.',
        points: 20,
      },
      {
        id: 'live-04-2',
        name: 'Set oder Map für Zeichen',
        pattern: 'Set|Map|new Set|new Map|\\{\\s*\\}',
        isRegex: true,
        errorMessage: 'Nutze eine Set/Map um Zeichen im Fenster zu tracken.',
        points: 50,
      },
      {
        id: 'live-04-3',
        name: 'Fenster-Logik (left/right oder start/end)',
        pattern: 'left|right|start|end|while|max\\s*=.*Math\\.max',
        isRegex: true,
        errorMessage: 'Sliding-Window-Logik mit Grenzen und max-Update.',
        points: 50,
      },
    ],
    solution: `function lengthOfLongestSubstring(s: string): number {
  const set = new Set<string>();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
`,
  },
  {
    id: 'live-05',
    source: 'live-coding',
    title: 'Valid Anagram',
    description: 'Prüfe, ob zwei Strings Anagramme sind (gleiche Zeichen, andere Reihenfolge).',
    category: 'Strings & Arrays',
    difficulty: 'Fortgeschritten',
    timeLimit: 240,
    points: 90,
    instruction: `Implementiere isAnagram(s: string, t: string): boolean.
- Beide Strings haben dieselbe Zeichenverteilung (gleiche Anzahl pro Zeichen).
- Beispiel: "anagram", "nagaram" → true.`,
    starterCode: `function isAnagram(s: string, t: string): boolean {
  return false;
}
`,
    language: 'typescript',
    hints: [
      'Länge muss gleich sein, sonst sofort false.',
      'Zeichenhäufigkeit zählen: Map oder sortierte Strings vergleichen.',
    ],
    validations: [
      {
        id: 'live-05-1',
        name: 'Funktion isAnagram',
        pattern: 'isAnagram',
        isRegex: false,
        errorMessage: 'Die Funktion muss isAnagram heißen.',
        points: 20,
      },
      {
        id: 'live-05-2',
        name: 'Häufigkeit oder Sortierung',
        pattern: 'Map|split\\(.*\\)\\.sort|get\\(|set\\(|\\[^\\]\\.sort',
        isRegex: true,
        errorMessage: 'Nutze Häufigkeits-Count (Map) oder Sortierung zum Vergleichen.',
        points: 45,
      },
    ],
    solution: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const map = new Map<string, number>();
  for (const c of s) map.set(c, (map.get(c) ?? 0) + 1);
  for (const c of t) {
    const n = map.get(c) ?? 0;
    if (n === 0) return false;
    map.set(c, n - 1);
  }
  return true;
}
`,
  },
  {
    id: 'live-06',
    source: 'live-coding',
    title: 'Binary Search',
    description: 'Klassische binäre Suche in sortiertem Array. O(log n).',
    category: 'Algorithmen',
    difficulty: 'Fortgeschritten',
    timeLimit: 300,
    points: 100,
    instruction: `Implementiere binarySearch(nums: number[], target: number): number.
- nums ist aufsteigend sortiert. Gib den Index von target zurück, sonst -1.`,
    starterCode: `function binarySearch(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  // Dein Code
  return -1;
}
`,
    language: 'typescript',
    hints: [
      'Solange left <= right: mid = (left + right) >> 1.',
      'Wenn nums[mid] === target → return mid; wenn kleiner → right = mid - 1, sonst left = mid + 1.',
    ],
    validations: [
      {
        id: 'live-06-1',
        name: 'Funktion binarySearch',
        pattern: 'binarySearch',
        isRegex: false,
        errorMessage: 'Die Funktion muss binarySearch heißen.',
        points: 20,
      },
      {
        id: 'live-06-2',
        name: 'Halbierungs-Logik',
        pattern: 'mid|left.*right|right.*left|>>\\s*1|Math\\.floor.*/\\s*2',
        isRegex: true,
        errorMessage: 'Typische Binary-Search-Grenzen (left, right, mid).',
        points: 50,
      },
    ],
    solution: `function binarySearch(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = (left + right) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
`,
  },

  // ─── Expert / Harte Nüsse ──────────────────────────────
  {
    id: 'live-07',
    source: 'live-coding',
    title: 'Sliding Window Maximum',
    description: 'Für jedes Fenster der Größe k das Maximum finden. Deque/Monotoner Stack.',
    category: 'Algorithmen',
    difficulty: 'Expert',
    timeLimit: 600,
    points: 220,
    instruction: `Implementiere maxSlidingWindow(nums: number[], k: number): number[].
- Für jedes gleitende Fenster der Größe k gib das Maximum im Fenster zurück.
- Beispiel: nums = [1,3,-1,-3,5,3,6,7], k = 3 → [3,3,5,5,6,7].
- Ziel: O(n), nicht O(n*k). Tipp: monotone (decreasing) Deque.`,
    starterCode: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  // Deque: Indizes speichern, Werte absteigend halten
  return result;
}
`,
    language: 'typescript',
    hints: [
      'Deque (Array mit push/pop von vorne): speichere Indizes, nicht Werte.',
      'Vor dem Push: alle kleineren Elemente vom Ende entfernen (monoton fallend).',
      'Das Maximum ist immer am Anfang der Deque; Fenster verschieben und veraltete Indizes entfernen.',
    ],
    validations: [
      {
        id: 'live-07-1',
        name: 'Funktion maxSlidingWindow',
        pattern: 'maxSlidingWindow',
        isRegex: false,
        errorMessage: 'Die Funktion muss maxSlidingWindow heißen.',
        points: 25,
      },
      {
        id: 'live-07-2',
        name: 'Deque/Array mit shift oder Indizes',
        pattern: 'shift\\(\\)|deque|queue|\\[\\s*\\].*push.*shift|unshift',
        isRegex: true,
        errorMessage: 'Eine Deque-ähnliche Struktur (Indizes von vorne/hinten).',
        points: 70,
      },
      {
        id: 'live-07-3',
        name: 'Fenster-Größe k',
        pattern: 'k|i\\s*-\\s*k|right\\s*-\\s*k|>=.*k',
        isRegex: true,
        errorMessage: 'Fenster der Größe k muss berücksichtigt werden.',
        points: 55,
      },
    ],
    solution: `function maxSlidingWindow(nums: number[], k: number): number[] {
  const deque: number[] = [];
  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (deque[0] <= i - k) deque.shift();
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}
`,
  },
  {
    id: 'live-08',
    source: 'live-coding',
    title: 'Minimum Window Substring',
    description: 'Kürzester Teilstring von s, der alle Zeichen aus t enthält. Hard Sliding Window.',
    category: 'Strings & Arrays',
    difficulty: 'Expert',
    timeLimit: 720,
    points: 250,
    instruction: `Implementiere minWindow(s: string, t: string): string.
- Finde den kürzesten Teilstring von s, der alle Zeichen aus t (inkl. Häufigkeit) enthält.
- Beispiel: s = "ADOBECODEBANC", t = "ABC" → "BANC".
- Leerstring zurückgeben, wenn kein gültiges Fenster existiert.`,
    starterCode: `function minWindow(s: string, t: string): string {
  let minLen = Infinity, start = 0;
  // Sliding Window + Häufigkeits-Maps für t und aktuelles Fenster
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}
`,
    language: 'typescript',
    hints: [
      'Zähle Zeichenhäufigkeit in t (need). Fenster mit Map für current.',
      'Erweitere right bis alle Zeichen aus t abgedeckt; dann shrink left.',
      'Vergleiche "formed" (wie viele Zeichen erfüllt) mit need.size.',
    ],
    validations: [
      {
        id: 'live-08-1',
        name: 'Funktion minWindow',
        pattern: 'minWindow',
        isRegex: false,
        errorMessage: 'Die Funktion muss minWindow heißen.',
        points: 25,
      },
      {
        id: 'live-08-2',
        name: 'Häufigkeit für t',
        pattern: 'Map|get\\(|set\\(|need|count|freq',
        isRegex: true,
        errorMessage: 'Häufigkeits-Count für t (und Fenster).',
        points: 80,
      },
      {
        id: 'live-08-3',
        name: 'Fenster (left/right oder start/end)',
        pattern: 'left|right|start|end|slice|substring',
        isRegex: true,
        errorMessage: 'Sliding-Window mit Grenzen und slice/substring.',
        points: 75,
      },
    ],
    solution: `function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  const current = new Map<string, number>();
  let left = 0, formed = 0, required = need.size;
  let minLen = Infinity, start = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    current.set(c, (current.get(c) ?? 0) + 1);
    if (need.has(c) && current.get(c) === need.get(c)) formed++;
    while (formed === required && left <= right) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const l = s[left];
      current.set(l, current.get(l)! - 1);
      if (need.has(l) && current.get(l)! < need.get(l)!) formed--;
      left++;
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}
`,
  },
  {
    id: 'live-09',
    source: 'live-coding',
    title: 'Fibonacci mit Memoization (DP)',
    description: 'Fibonacci-Zahl mit Dynamischer Programmierung (Memo) in O(n).',
    category: 'Rekursion & DP',
    difficulty: 'Expert',
    timeLimit: 420,
    points: 180,
    instruction: `Implementiere fib(n: number): number.
- fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).
- Nutze Memoization (Map oder Array), damit jede Teilberechnung nur einmal ausgeführt wird.`,
    starterCode: `function fib(n: number): number {
  // Memo: Map<number, number> oder number[]
  return 0;
}
`,
    language: 'typescript',
    hints: [
      'Base cases: n <= 1 → return n.',
      'Vor der Rekursion: if (memo.has(n)) return memo.get(n); danach Ergebnis speichern.',
    ],
    validations: [
      {
        id: 'live-09-1',
        name: 'Funktion fib',
        pattern: 'fib\\s*\\(|function fib',
        isRegex: true,
        errorMessage: 'Die Funktion muss fib heißen.',
        points: 20,
      },
      {
        id: 'live-09-2',
        name: 'Memoization',
        pattern: 'Map|memo|\\[\\s*\\]|cache|get\\(|set\\(',
        isRegex: true,
        errorMessage: 'Memo/Cache (Map oder Array) für bereits berechnete Werte.',
        points: 90,
      },
      {
        id: 'live-09-3',
        name: 'Rekursion oder Iteration mit Speicher',
        pattern: 'fib\\(.*-\\s*1\\)|fib\\(.*-\\s*2\\)|for.*n|n\\s*-\\s*1|n\\s*-\\s*2',
        isRegex: true,
        errorMessage: 'Rekursive Aufrufe fib(n-1), fib(n-2) oder iterative DP.',
        points: 50,
      },
    ],
    solution: `function fib(n: number): number {
  if (n <= 1) return n;
  const memo = new Map<number, number>();
  function f(k: number): number {
    if (k <= 1) return k;
    if (memo.has(k)) return memo.get(k)!;
    const val = f(k - 1) + f(k - 2);
    memo.set(k, val);
    return val;
  }
  return f(n);
}
`,
  },
  {
    id: 'live-10',
    source: 'live-coding',
    title: 'BFS – Kürzester Pfad in Matrix',
    description: 'Kürzeste Distanz von Start zu Ziel in 0/1-Matrix. Breitensuche (BFS).',
    category: 'Graphen & BFS/DFS',
    difficulty: 'Expert',
    timeLimit: 600,
    points: 230,
    instruction: `Implementiere shortestPath(grid: number[][], start: [number, number], end: [number, number]): number.
- grid: 0 = begehbar, 1 = Wand. Gib die Anzahl Schritte (Manhattan) von start zu end zurück, -1 wenn nicht erreichbar.
- Nur 4-Nachbarn (oben, unten, links, rechts). Nutze BFS (Queue).`,
    starterCode: `function shortestPath(
  grid: number[][],
  start: [number, number],
  end: [number, number]
): number {
  const [sr, sc] = start, [er, ec] = end;
  // BFS mit Queue: [row, col, steps]
  return -1;
}
`,
    language: 'typescript',
    hints: [
      'Queue mit [row, col, steps]. Besuchte Zellen markieren (Set oder grid ändern).',
      'Nachbarn: [r-1,c], [r+1,c], [r,c-1], [r,c+1]. Grenzen und grid[r][c] === 0 prüfen.',
      'Wenn (r,c) === (er,ec), steps zurückgeben.',
    ],
    validations: [
      {
        id: 'live-10-1',
        name: 'Funktion shortestPath',
        pattern: 'shortestPath',
        isRegex: false,
        errorMessage: 'Die Funktion muss shortestPath heißen.',
        points: 25,
      },
      {
        id: 'live-10-2',
        name: 'Queue für BFS',
        pattern: 'shift\\(\\)|push\\(|queue|\\[\\s*\\].*length',
        isRegex: true,
        errorMessage: 'Eine Queue (Array mit shift/push) für BFS.',
        points: 70,
      },
      {
        id: 'live-10-3',
        name: 'Nachbarn / Richtungen',
        pattern: '\\+1|-1|dr|dc|directions|neighbors|row.*col',
        isRegex: true,
        errorMessage: 'Nachbarn in 4 Richtungen (row/col ±1).',
        points: 70,
      },
    ],
    solution: `function shortestPath(
  grid: number[][],
  start: [number, number],
  end: [number, number]
): number {
  const [sr, sc] = start, [er, ec] = end;
  const R = grid.length, C = grid[0].length;
  const vis = new Set<string>();
  const key = (r: number, c: number) => r + ',' + c;
  const queue: [number, number, number][] = [[sr, sc, 0]];
  vis.add(key(sr, sc));
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  while (queue.length) {
    const [r, c, steps] = queue.shift()!;
    if (r === er && c === ec) return steps;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr][nc] === 1 || vis.has(key(nr, nc))) continue;
      vis.add(key(nr, nc));
      queue.push([nr, nc, steps + 1]);
    }
  }
  return -1;
}
`,
  },
  {
    id: 'live-11',
    source: 'live-coding',
    title: 'Trapping Rain Water',
    description: 'Wie viel Regenwasser kann zwischen den Balken gefangen werden? Two Pointers / DP.',
    category: 'Algorithmen',
    difficulty: 'Expert',
    timeLimit: 540,
    points: 240,
    instruction: `Implementiere trap(height: number[]): number.
- height[i] = Höhe des Balkens an Position i. Berechne die Menge Wasser, die nach Regen gefangen wird.
- Beispiel: [0,1,0,2,1,0,1,3,2,1,2,1] → 6.`,
    starterCode: `function trap(height: number[]): number {
  let water = 0;
  // Two Pointers: leftMax, rightMax oder Prefix-Max-Arrays
  return water;
}
`,
    language: 'typescript',
    hints: [
      'Für jede Position: Wasser = min(leftMax, rightMax) - height[i] (wenn positiv).',
      'Two Pointer: left/right, leftMax/rightMax; immer die Seite mit kleinerem Max bewegen.',
    ],
    validations: [
      {
        id: 'live-11-1',
        name: 'Funktion trap',
        pattern: 'trap\\s*\\(|function trap',
        isRegex: true,
        errorMessage: 'Die Funktion muss trap heißen.',
        points: 20,
      },
      {
        id: 'live-11-2',
        name: 'Max links/rechts oder Two Pointer',
        pattern: 'leftMax|rightMax|Math\\.max|left.*right|prefix|suffix',
        isRegex: true,
        errorMessage: 'Linkes/rechtes Maximum oder Two-Pointer-Logik.',
        points: 100,
      },
      {
        id: 'live-11-3',
        name: 'Wasser berechnen',
        pattern: 'water|\\+\\s*=|min\\(|height\\[',
        isRegex: true,
        errorMessage: 'Wasser pro Stelle berechnen und aufsummieren.',
        points: 70,
      },
    ],
    solution: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
`,
  },
  {
    id: 'live-12',
    source: 'live-coding',
    title: 'Merge Overlapping Intervals',
    description: 'Überlappende Intervalle zusammenführen. Sortieren + linearer Durchlauf.',
    category: 'Datenstrukturen',
    difficulty: 'Fortgeschritten',
    timeLimit: 420,
    points: 160,
    instruction: `Implementiere mergeIntervals(intervals: [number, number][]): [number, number][].
- Überlappende oder angrenzende Intervalle zusammenführen, sortiert zurückgeben.
- Beispiel: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]].`,
    starterCode: `function mergeIntervals(intervals: [number, number][]): [number, number][] {
  const out: [number, number][] = [];
  // Nach Start sortieren, dann mergen
  return out;
}
`,
    language: 'typescript',
    hints: [
      'Intervalle nach intervals[i][0] sortieren.',
      'Wenn aktuelles Intervall in das letzte in out passt: out[last][1] = max(out[last][1], cur[1]); sonst push.',
    ],
    validations: [
      {
        id: 'live-12-1',
        name: 'Funktion mergeIntervals',
        pattern: 'mergeIntervals',
        isRegex: false,
        errorMessage: 'Die Funktion muss mergeIntervals heißen.',
        points: 25,
      },
      {
        id: 'live-12-2',
        name: 'Sortieren nach Start',
        pattern: 'sort\\(|\\[0\\]|start|a\\[0\\].*b\\[0\\]',
        isRegex: true,
        errorMessage: 'Intervalle nach Startwert sortieren.',
        points: 55,
      },
      {
        id: 'live-12-3',
        name: 'Merge-Logik (Ende vergleichen)',
        pattern: '\\[1\\]|end|push\\(|out\\.push|merge',
        isRegex: true,
        errorMessage: 'Überlappung prüfen und Ende erweitern oder neues Intervall pushen.',
        points: 55,
      },
    ],
    solution: `function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = out[out.length - 1];
    if (intervals[i][0] <= last[1])
      last[1] = Math.max(last[1], intervals[i][1]);
    else
      out.push(intervals[i]);
  }
  return out;
}
`,
  },
];

/** Alle Kategorien der Live-Coding-Challenges */
export const liveCodingCategories: string[] = [
  ...new Set(liveCodingChallenges.map((c) => c.category)),
];

/** Live-Coding-Schwierigkeiten (inkl. Expert) */
export const liveCodingDifficulties: string[] = ['Anfänger', 'Fortgeschritten', 'Expert'];
