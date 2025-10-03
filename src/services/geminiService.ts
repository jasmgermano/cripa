import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const generateTips = async (words: string[], apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
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
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", safetySettings });

  const prompt = `Gere exatamente uma dica no estilo de palavras cruzadas para cada uma das seguintes palavras: 
                  ${words.join(", ")}. 
                  Para cada palavra, a dica deve ser criativa e sugerir o significado da palavra sem mencioná-la diretamente.
                  Se a palavra tiver múltiplos significados, escolha o mais comum. A dica deve ser concisa, informativa e adequada ao contexto. 
                  Evite prefixos como "Dica:" e evite usar asteriscos, aspas ou qualquer formatação adicional.
                  A dica deve estar relacionada ao significado geral da palavra, sinônimos ou frases relacionadas.

                  Atenção: algumas palavras podem ser nomes de filmes, livros, músicas ou celebridades, então as dicas devem refletir essa possibilidade quando apropriado.
                  Se for um filme, por exemplo, indique que é um filme. Se for um livro, indique que é um livro. Se for uma música, indique que é uma música.

                  Exemplos:
                  - Se a palavra for um verbo como "desistir", use algo como "abrir mão de algo planejado".
                  - Se a palavra for um substantivo como "relógio", use algo como "marca as horas".
                  - Se a palavra for um nome de filme como "Poderoso Chefão", use algo como "clássico de máfia dirigido por Francis Ford Coppola".
                  
                  Responda no formato de array JSON com a mesma quantidade de entradas que as palavras fornecidas, exemplo: 
                  ["Dois que compartilham a vida e o amor.", "Espaço fortificado para abrigo e defesa."]`;

  try {
    const result = await model.generateContent(prompt);
    let content = result.response.candidates?.[0].content.parts[0].text || "";

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
      return words.map((word) => ({ clue: `Dica não disponível para "${word}".` }));
    }
    
    // Analisar o array JSON
    let tips: string[];
    try {
      tips = JSON.parse(content);
    } catch (parseError) {
      console.error("Erro ao analisar dicas como JSON:", parseError);
      return words.map((word) => ({ clue: `Dica não disponível para "${word}".` }));
    }

    // Verificar se o resultado é um array válido e contém exatamente a quantidade esperada de dicas
    if (!Array.isArray(tips) || tips.length !== words.length) {
      console.warn("A quantidade de dicas geradas não corresponde à quantidade de palavras fornecidas.");
      return words.map((word, index) => ({ clue: tips[index] || `Dica não disponível para "${word}".` }));
    }

    // Mapear as dicas para o formato desejado
    return tips.map((tip) => ({ clue: tip }));
  } catch (error) {
    console.error("Erro ao gerar dicas:", error);
    return words.map((word) => ({ clue: `Dica não disponível para "${word}".` }));
  }
};
