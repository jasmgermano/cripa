import { generateTips } from '@/services/geminiService';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';


interface WordData {
    words: string[];
}

export default function useCripa() {
    const [data, setData] = useState<WordData>({ words: [] });
    const [solutions, setSolutions] = useState<string[]>([]);
    const [alphabetMap, setAlphabetMap] = useState<{ [key: string]: number }>({});
    const [resultArray, setResultArray] = useState<{ number: number, isTermLetter: boolean }[][]>([]);
    const [Trys, setTrys] = useState<{ [key: number]: string }>({});
    const [term, setTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);  // Estado de loading
    const [soltionsTips, setSolutionsTips] = useState<{ clue: any }[]>([]);
    const [termTip, setTermTip] = useState<{ clue: any }[]>([]);
    let uniqueIndexTerm = -1;
    const [isAllCorrect, setIsAllCorrect] = useState<boolean>(false);
    const [correctLetters, setCorrectLetters] = useState<{ [key: string]: boolean }>({});
    const [isMobile, setIsMobile] = useState<boolean>();
    const [currentCuriosity, setCurrentCuriosity] = useState<{ text: string; link?: string } | null>(null);
    // Função para buscar os dados das palavras
    const fetchWordData = async () => {
        if (isMobile) return;

        try {
            const response = await fetch("/api/fetchWordData", {
                cache: 'no-store',
              });
            if (!response.ok) {
                throw new Error("Erro ao buscar os dados da palavra");
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
        }
    };

    // Função para buscar as soluções
    const getSolutions = async () => {        
        const term = await getTerm();
        const normalizedTerm = normalizeText(term ?? ""); // Normaliza o termo
        const termArray = normalizedTerm.split("").filter((char) => char.trim() !== "");
        let solutions: string[] = [];
        let availableWords = [...data.words];

        if (data.words.length > 0) {
            while (solutions.length < 14 && availableWords.length > 0) {
                termArray.forEach((letter: string) => {
                    let found = false;
                    while (!found) {
                        const index = Math.floor(Math.random() * availableWords.length);
                        const word = availableWords[index];
                        const normalizedWord = normalizeText(word); 
                        const letterIndex = normalizedWord.toLowerCase().indexOf(letter.toLowerCase());

                        if (letterIndex !== -1) { 
                            availableWords.splice(index, 1);
                            solutions.push(word);
                            found = true;
                        }
                    }
                });
            }
        }

        setSolutions(solutions);
        setTerm(normalizedTerm);
    };
    

    // Função para buscar os termos
    const fetchTerms = async () => {       
        try {
            const response = await fetch(`https://gist.githubusercontent.com/jasmgermano/af07dc866dd7debd99448a0d887f86e5/raw/2abf2809836b2e48934bbe22d56515c627709730/termos.json`, {
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar os termos");
            }
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(error);
        }
    };

    // Função para pegar um termo de 14 letras
    const getTerm = async () => {
        const terms = await fetchTerms();
        const terms14letters = terms?.termos.filter((term: string) => {
            const lettersOnly = term.match(/[a-zA-ZÀ-ÿ]/g);
            return lettersOnly && lettersOnly.length === 14;
        });

        if (terms14letters.length > 0) {
            const randomIndex = Math.floor(Math.random() * terms14letters.length);
            return normalizeText(terms14letters[randomIndex]);
        }
    };

    // Efeito para buscar os dados das palavras
    useEffect(() => {
        fetchWordData();
    }, []);
    

    // Efeito para buscar as soluções quando as palavras forem carregadas
    useEffect(() => {
        if (data.words.length > 0 && solutions.length === 0) {
            getSolutions();
        }
    }, [data]);

    // Função para remover acentos e caracteres especiais
    const normalizeText = (text: string) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    };


    const handleKeyUp = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase();
      
        if (key === "backspace" || key === "delete") {
          processLetterInput(null);
        } else if (/^[a-z]$/.test(key)) {
          processLetterInput(key);
        }
      };

      const processLetterInput = (letter: string | null) => {
        const activeElements = document.querySelectorAll(".active");
        let mapTrys = { ...Trys };
        const normalizedLetter = letter ? normalizeText(letter.toLowerCase()) : null;
      
        activeElements.forEach((element) => {
          let number = 0;
          const spanActive = element.querySelectorAll("span")[1];
          const classList = spanActive.classList;
          const cellId = element.closest("td")?.getAttribute("data-id");
      
          // Impede alteração de letras corretas
          if (cellId && correctLetters[cellId]) return;
      
          classList.forEach((className) => {
            if (/^letter-\d+$/.test(className)) {
              number = parseInt(className.split("-")[1]);
            }
          });
      
          if (!normalizedLetter) {
            spanActive.textContent = "";
            delete mapTrys[number];
          } else if (/^[a-z]$/.test(normalizedLetter)) {
            // Remove letras duplicadas
            for (const [key, value] of Object.entries(mapTrys)) {
              if (value === normalizedLetter && parseInt(key) !== number && number !== 0) {
                const foundElements = document.querySelectorAll(`.letter-${key}`);
                foundElements.forEach((el) => (el.textContent = ""));
                delete mapTrys[parseInt(key)];
              }
            }
      
            element.classList.remove("bg-red-300", "bg-red-400");
            spanActive.textContent = normalizedLetter.toUpperCase();
            mapTrys[number] = normalizedLetter;
          }
        });
      
        setTrys(mapTrys);
      };
      
      
    // Função para gerar o mapa do alfabeto
    const generateAlphabetMap = () => {
        const alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
        const map: { [key: string]: number } = {};
        const numbers = Array.from({ length: 26 }, (_, i) => i + 1);

        const shuffle = (array: number[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        };

        shuffle(numbers);
        alphabet.forEach((letter, index) => {
            map[letter] = numbers[index];
        });
        setAlphabetMap(map);
    };

    const compareLetters = (solution: string, letterIndexInSolution: number) => {
        if (Object.keys(alphabetMap).length === 0) {
            return []; // Retorne um array vazio se o alphabetMap estiver vazio
        }

        const normalizedSolution = normalizeText(solution); // Normaliza a solução
        const solutionArray = normalizedSolution.toLowerCase().split("");
        const updateArray: { number: number, isTermLetter: boolean }[] = [];

        solutionArray.forEach((solutionLetter, index) => {
            const isTermLetter = index === letterIndexInSolution;
            
            if (solutionLetter in alphabetMap) {
                if (isTermLetter) {
                    updateArray.push({
                        number: uniqueIndexTerm,
                        isTermLetter: isTermLetter
                    });

                    uniqueIndexTerm--;
                } else {
                    updateArray.push({
                        number: alphabetMap[solutionLetter],
                        isTermLetter: isTermLetter
                    });
                }
            }
        });

        return updateArray;
    };


    // Efeito para atualizar o resultArray
    useEffect(() => {
        if (solutions.length > 0 && Object.keys(alphabetMap).length > 0) {
            const result = solutions
                .map((solution, index) => {
                    const termWithoutSpaces = term.replace(/\s/g, "");
                    const letterIndexInSolution = normalizeText(solution.toLowerCase()).indexOf(normalizeText(termWithoutSpaces[index]?.toLowerCase() ?? ""));

                    return compareLetters(solution, letterIndexInSolution);
                })
                .filter((item) => item.length > 0);

            setResultArray(result as { number: number, isTermLetter: boolean }[][]);
        }
    }, [solutions, alphabetMap]);

    const handleVerify = () => {
        let checkedIndexes: number[] = [];
        let termWithoutSpaces = term.replace(/\s/g, "");
        const activeElements = document.querySelectorAll(".active");
        let newCorrectLetters = { ...correctLetters }; // Copia o estado atual
        let correct = true;
    
        // Remover a classe 'active' de todos os elementos
        activeElements.forEach((element) => {
            element.classList.remove("active");
        });
    
        // Limpeza das classes de fundo antes de adicionar novas
        const allTdElements = document.querySelectorAll("td");
        allTdElements.forEach((td) => {
            td.classList.remove("bg-green-200", "bg-green-400", "bg-red-200");
        });
    
        solutions.forEach((solution, index) => {
            const element = document.querySelector(`.row-${index}`);
            const solutionArray = normalizeText(solution).split("");
            let termGuesses = [];
    
            solutionArray.forEach((letter, letterIndex) => {
                const indexInTerm = normalizeText(termWithoutSpaces.toLowerCase()).indexOf(normalizeText(letter?.toLowerCase() ?? ""));
                const elementsToCheck = element?.querySelectorAll(`.letter-${alphabetMap[letter.toLowerCase()]}`);
            
                const elementToCheck = element?.querySelector(`.letter--${index + 1}`);
                const tdActive = elementToCheck?.closest("td");
                
                if (elementToCheck && tdActive) {

                    if (indexInTerm === index) {                        
                        termWithoutSpaces = termWithoutSpaces.substring(0, indexInTerm) + " " + termWithoutSpaces.substring(indexInTerm + 1);
                        tdActive.classList.remove("bg-green-300", "bg-red-400");
                        if (elementToCheck.textContent === letter.toUpperCase().trim()) {
                            tdActive.classList.add("bg-green-300");
                            checkedIndexes.push(indexInTerm);
                            newCorrectLetters[letter] = true;
                        } else {
                            tdActive.classList.add("bg-red-400");
                            correct = false;
                        }
                    } 
                }
            
                if (elementsToCheck) {
                    elementsToCheck.forEach((elementToCheck) => {
                        const tdActive = elementToCheck?.closest("td");
            
                        if (tdActive) {
                            tdActive.classList.remove("bg-green-400", "bg-red-300");
            
                            if (elementToCheck.textContent === letter.toUpperCase()) {
                                tdActive.classList.add("bg-green-400");
                                termGuesses.push({ letter: letter, index: letterIndex });
                            } else {
                                tdActive.classList.add("bg-red-300");
                                correct = false;
                            }
                        }
                    });
                } else {
                    console.log("elemento não encontrado", letter);
                }
            });            
        });

        setCorrectLetters(newCorrectLetters);
        setIsAllCorrect(correct);
    };

    useEffect(() => {
        if (isAllCorrect) {
            const duration = 10 * 1000;
            const end = Date.now() + duration;

            const colors = ['#ff0a54', '#ff477e', '#ff85a1', '#fbb1bd', '#f9bec7']; 

            const frame = () => {
                confetti({
                    particleCount: 5, // Número de confetes por chamada
                    angle: 90, // Ângulo para cair de cima para baixo
                    spread: 45, // Spread pequeno para cair de forma mais linear
                    origin: { x: Math.random(), y: 0 }, // Origem aleatória ao longo do topo
                    gravity: 1, // Gravidade alta para simular queda rápida
                    shapes: ['star'], // Formato de estrela
                    colors: colors, 
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame); // Continua até o fim da duração
                }
            };

            frame(); // Inicia a animação dos confetes caindo
        }
    }, [isAllCorrect]);
    

    const handleGenerateTips = async () => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;

            if (!apiKey) {
                throw new Error("API Key não encontrada");
            }

            if (solutions.length !== 0) {
                const tipsforSolutions = await generateTips(solutions, apiKey);
                setSolutionsTips(tipsforSolutions);
            }

            if (term) {
                const termArray = new Array(1).fill(0);
                termArray[0] = term;
    
                const tipForTerm = await generateTips(termArray, apiKey);
                setTermTip(tipForTerm);
            }


        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGenerateTips();
    }, [term]);

    useEffect(() => {
        if (solutions.length > 0 && term.length > 0 && soltionsTips.length > 0 && termTip.length > 0) {
            setLoading(false);
        }
    }, [solutions, term, termTip, soltionsTips]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const updateIsMobile = () => {
                const mobile = window.matchMedia("(max-width: 768px)").matches;
                console.log("Resize detectado. Is mobile?", mobile);
                setIsMobile(mobile);
            };
    
            updateIsMobile();
            window.addEventListener("resize", updateIsMobile);
    
            return () => {
                window.removeEventListener("resize", updateIsMobile);
            };
        }
    }, []);

    useEffect(() => {
        const curiosities = [
            { text: "O escritor Edgar Allan Poe ajudou a popularizar os criptogramas no século XIX, publicando artigos em jornais e revistas" },
            { text: "Você sabia que o termo 'criptograma' vem do grego 'kryptós' (oculto) e 'grámma' (letra)?" },
            { text: "Resolver criptogramas ajuda a treinar a memória e o pensamento crítico, promovendo saúde cerebral" },
            { text: "Dica: geralmente, as letras mais comuns em português são 'A', 'E', 'O', 'S' e 'R'" },
            { text: "Jogos do tipo passatempo, como criptogramas, estimulam a criação de uma nova linha de raciocínio, provocando sinapses e causando neurogênese em várias áreas da cabeça." },
            { text: "Você sabia? Jogos de palavra podem contribuir para a prevenção de doenças neurodegenerativas, como a doença de Alzheimer" },
            { text: "Professores utilizam criptogramas para ensinar lógica, alfabetização e até mesmo história, quando as mensagens decifradas têm um contexto cultural ou histórico" },
            { text: "O primeiro registro histórico de um criptograma foi encontrado em uma inscrição cuneiforme na antiga Mesopotâmia, datada de 1500 a.C." },
            { text: 'Historicamente, criptogramas foram utilizados para proteger informações sensíveis. Um exemplo famoso é o "Zodiac Killer", que enviou quatro criptogramas à polícia nos anos 1960.' },
            { text: "A desenvolvedora do Cripa tem um portfólio beeem legal! ★ Confira em ", link: "https://jasminegermano.vercel.app/" },
            { text: "Pessoas que jogam o cripa frequentemente têm 100% mais chances de se tornarem mais inteligentes e bonitas. Faça o teste! 😜" },
          ];          
    
        const randomCuriosity = curiosities[Math.floor(Math.random() * curiosities.length)];
        setCurrentCuriosity(randomCuriosity);    
      }, []);
    

    return { data, solutions, handleKeyUp, processLetterInput, generateAlphabetMap, resultArray, alphabetMap, term, loading, handleVerify, termTip, soltionsTips, isAllCorrect, setIsAllCorrect, correctLetters, isMobile, currentCuriosity };
}
