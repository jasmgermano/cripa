import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import type { WordEntry } from "@/utils/wordEntries";

interface GenerateTipsOptions {
  seed?: number;
  temperature?: number;
}

type TipSubject = string | WordEntry;

export const generateTips = async (words: TipSubject[], apiKey: string, options: GenerateTipsOptions = {}) => {
  const genAI = new GoogleGenAI({ apiKey });
  const subjects = words.map((subject) => typeof subject === "string" ? { word: subject } : subject);
  const describedSubjects = subjects.map((subject, index) => {
    const details = [
      `termo: ${subject.word}`,
      subject.category ? `categoria: ${subject.category}` : null,
      subject.context ? `contexto: ${subject.context}` : null,
    ].filter(Boolean).join("; ");
    return `${index + 1}. ${details}`;
  }).join("\n");
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
  const prompt = `Gere exatamente uma dica no estilo de palavras cruzadas para cada um dos seguintes termos, preservando a ordem:
                  ${describedSubjects}

                  Para cada palavra, a dica deve ser criativa e sugerir o significado da palavra sem mencioná-la diretamente.
                  Quando uma categoria ou um contexto forem fornecidos, eles são obrigatórios e devem determinar o sentido da dica.
                  Não troque uma obra, pessoa ou personagem pelo significado literal das palavras do título ou do nome.
                  Somente quando não houver categoria nem contexto, escolha o significado mais comum.
                  A dica deve ser concisa, informativa e adequada ao contexto.
                  Evite prefixos como "Dica:" e evite usar asteriscos, aspas ou qualquer formatação adicional.
                  Se a categoria indicar filme, livro, música, série, pessoa, celebridade ou personagem, deixe essa natureza clara na dica.

                  Exemplos:
                  - Se a palavra for um verbo como "desistir", use algo como "abrir mão de algo planejado".
                  - Se a palavra for um substantivo como "relógio", use algo como "marca as horas".
                  - Se a palavra for um nome de filme como "Poderoso Chefão", use algo como "clássico de máfia dirigido por Francis Ford Coppola".
                  
                  Responda no formato de array JSON com a mesma quantidade de entradas que as palavras fornecidas, exemplo: 
                  ["Dois que compartilham a vida e o amor.", "Espaço fortificado para abrigo e defesa."]`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        safetySettings,
        seed: options.seed,
        temperature: options.temperature,
      },
    });
    let content = result.text || "";

    // Limpeza do conteúdo gerado
    content = content
      .replace(/\n/g, '') // Remove quebras de linha
      .replace(/,\s*]/g, ']') // Remove vírgulas extras antes do fechamento do array

    // Tentar extrair apenas o array JSON do conteúdo retornado
    const arrayMatch = content.match(/\[(.*?)\]/); // Captura o array JSON
    if (arrayMatch) {
      content = arrayMatch[0];
    } else {
      console.warn("Array JSON não encontrado no conteúdo gerado.");
      return subjects.map(() => ({ clue: "Dica temporariamente indisponível." }));
    }
    
    // Analisar o array JSON
    let tips: string[];
    try {
      tips = JSON.parse(content);
    } catch (parseError) {
      console.error("Erro ao analisar dicas como JSON:", parseError);
      return subjects.map(() => ({ clue: "Dica temporariamente indisponível." }));
    }

    // Verificar se o resultado é um array válido e contém exatamente a quantidade esperada de dicas
    if (!Array.isArray(tips) || tips.length !== subjects.length) {
      console.warn("A quantidade de dicas geradas não corresponde à quantidade de palavras fornecidas.");
      return subjects.map((_, index) => ({ clue: tips[index] || "Dica temporariamente indisponível." }));
    }

    // Mapear as dicas para o formato desejado
    return tips.map((tip) => ({ clue: tip }));
  } catch (error) {
    console.error("Erro ao gerar dicas:", error);
    return subjects.map(() => ({ clue: "Dica temporariamente indisponível." }));
  }
};
