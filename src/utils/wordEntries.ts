export interface WordEntry {
  word: string;
  category?: string;
  context?: string;
}

const getFirstString = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
};

export const parseWordEntry = (value: unknown): WordEntry | null => {
  if (typeof value === "string") {
    const word = value.trim();
    return word ? { word } : null;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  const word = getFirstString(record, ["word", "palavra", "term", "termo", "name", "nome"]);
  if (!word) return null;

  return {
    word,
    category: getFirstString(record, ["category", "categoria", "type", "tipo"]),
    context: getFirstString(record, ["context", "contexto", "reference", "referencia", "artist", "artista"]),
  };
};

export const parseWordLine = (line: string): WordEntry | null => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return null;

  if (trimmedLine.startsWith("{")) {
    try {
      return parseWordEntry(JSON.parse(trimmedLine));
    } catch {
      return null;
    }
  }

  const delimiter = ["|", ";", "\t"].find((candidate) => trimmedLine.includes(candidate));
  if (!delimiter) return { word: trimmedLine };

  const [word, category, ...contextParts] = trimmedLine.split(delimiter).map((part) => part.trim());
  if (!word) return null;

  return {
    word,
    category: category || undefined,
    context: contextParts.join(` ${delimiter} `).trim() || undefined,
  };
};

export const parseWordEntries = (values: unknown): WordEntry[] => {
  if (!Array.isArray(values)) return [];
  return values.map(parseWordEntry).filter((entry): entry is WordEntry => entry !== null);
};
