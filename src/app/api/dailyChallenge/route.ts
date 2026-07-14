import { getStore } from "@netlify/blobs";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { generateTips } from "@/services/geminiService";

export const dynamic = "force-dynamic";

const TERMS_URL = "https://gist.githubusercontent.com/jasmgermano/af07dc866dd7debd99448a0d887f86e5/raw/2abf2809836b2e48934bbe22d56515c627709730/termos.json";
const DAILY_CHALLENGES_STORE = "daily-challenges";

interface Tip {
  clue: string;
}

interface DailyChallenge {
  id: string;
  term: string;
  solutions: string[];
  alphabetMap: Record<string, number>;
  solutionsTips: Tip[];
  termTip: Tip[];
}

let memoryCache: { id: string; challenge: DailyChallenge; expiresAt: number } | null = null;

const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getSaoPauloDate = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRandom = (seed: number) => {
  let value = seed;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const createAlphabetMap = (random: () => number) => {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const numbers = Array.from({ length: 26 }, (_, index) => index + 1);

  for (let index = numbers.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [numbers[index], numbers[target]] = [numbers[target], numbers[index]];
  }

  return Object.fromEntries(letters.map((letter, index) => [letter, numbers[index]]));
};

const generateChallenge = async (id: string): Promise<DailyChallenge> => {
  const seed = hashString(`cripa-${id}`);
  const random = createRandom(seed);
  const wordsPath = path.join(process.cwd(), "src", "app", "api", "fetchWordData", "data", "eight_letter_data.txt");

  const [wordsContent, termsResponse] = await Promise.all([
    fs.readFile(wordsPath, "utf-8"),
    fetch(TERMS_URL, { cache: "no-store" }),
  ]);

  if (!termsResponse.ok) {
    throw new Error("Não foi possível carregar os termos do desafio diário.");
  }

  const words = wordsContent
    .split("\n")
    .map((word) => word.trim())
    .filter((word) => normalizeText(word).replace(/\s+/g, "").length === 8);
  const termsData = await termsResponse.json() as { termos: string[] };
  const terms = termsData.termos.filter((term) => {
    const letters = normalizeText(term).match(/[a-zA-Z]/g);
    return letters?.length === 14;
  });

  if (terms.length === 0) {
    throw new Error("Nenhuma palavra secreta disponível para o desafio diário.");
  }

  const term = normalizeText(terms[Math.floor(random() * terms.length)]);
  const termLetters = term.replace(/\s/g, "").toLowerCase().split("");
  const availableWords = [...words];
  const solutions = termLetters.map((letter) => {
    const candidates = availableWords
      .map((word, index) => ({ word, index }))
      .filter(({ word }) => normalizeText(word).toLowerCase().includes(letter));

    if (candidates.length === 0) {
      throw new Error(`Não foi encontrada uma palavra para a letra ${letter}.`);
    }

    const selected = candidates[Math.floor(random() * candidates.length)];
    availableWords.splice(selected.index, 1);
    return selected.word;
  });

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY;
  const unavailableTips = [...solutions, term].map(() => ({ clue: "Dica temporariamente indisponível." }));
  const tips = apiKey
    ? await generateTips([...solutions, term], apiKey, { seed: seed & 0x7fffffff, temperature: 0 })
    : unavailableTips;

  return {
    id,
    term,
    solutions,
    alphabetMap: createAlphabetMap(random),
    solutionsTips: tips.slice(0, solutions.length),
    termTip: tips.slice(solutions.length),
  };
};

const getStoredChallenge = async (id: string) => {
  const store = getStore({ name: DAILY_CHALLENGES_STORE, consistency: "strong" });
  return store.get(id, { type: "json" }) as Promise<DailyChallenge | null>;
};

const storeChallenge = async (id: string, challenge: DailyChallenge) => {
  const store = getStore({ name: DAILY_CHALLENGES_STORE, consistency: "strong" });
  const result = await store.setJSON(id, challenge, { onlyIfNew: true });

  if (result.modified) {
    return challenge;
  }

  return getStoredChallenge(id);
};

export async function GET() {
  const id = getSaoPauloDate();

  try {
    if (memoryCache?.id === id && memoryCache.expiresAt > Date.now()) {
      return NextResponse.json(memoryCache.challenge, { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600" } });
    }

    let blobsAvailable = true;
    try {
      const stored = await getStoredChallenge(id);
      if (stored) {
        memoryCache = { id, challenge: stored, expiresAt: Number.MAX_SAFE_INTEGER };
        return NextResponse.json(stored, { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600" } });
      }
    } catch (error) {
      blobsAvailable = false;
      console.warn("Netlify Blobs indisponível; usando geração determinística.", error);
    }

    const generated = await generateChallenge(id);
    const hasUnavailableTips = [...generated.solutionsTips, ...generated.termTip]
      .some(({ clue }) => clue === "Dica temporariamente indisponível.");
    let challenge = generated;

    if (blobsAvailable && !hasUnavailableTips) {
      try {
        challenge = await storeChallenge(id, generated) ?? generated;
      } catch (error) {
        console.warn("Não foi possível armazenar o desafio diário; usando o pacote gerado.", error);
      }
    }

    memoryCache = {
      id,
      challenge,
      expiresAt: hasUnavailableTips ? Date.now() + 60_000 : Number.MAX_SAFE_INTEGER,
    };

    return NextResponse.json(challenge, { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600" } });
  } catch (error) {
    console.error("Erro ao preparar o desafio diário:", error);
    return NextResponse.json({ error: "Não foi possível preparar o desafio diário." }, { status: 500 });
  }
}
