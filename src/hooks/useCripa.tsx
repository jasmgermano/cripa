import { generateTips } from '@/services/geminiService';
import React, { useEffect, useState } from 'react';

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

    // Função para buscar os dados das palavras
    const fetchWordData = async () => {
        try {
            setLoading(true);  // Inicia o carregamento
            const response = await fetch("/api/fetchWordData");
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
                        const word = availableWords[index].replace(/\s+/g, "");
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
            const response = await fetch(`https://gist.githubusercontent.com/jasmgermano/af07dc866dd7debd99448a0d887f86e5/raw/b5fb1596d2e6c5ab551201a05d2c718f4e955ee4/termos.json`);
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
    }, []); // Apenas uma vez ao carregar

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


    // Função para manipular o evento de keyup
    const handleKeyUp = (event: KeyboardEvent) => {
        const activeElements = document.querySelectorAll(".active");
        const eventKey = event.key.toLowerCase();
        let mapTrys = { ...Trys };

        activeElements.forEach((element) => {
            let number = 0;
            const spanActive = element.querySelectorAll("span")[1];
            const classList = spanActive.classList;

            classList.forEach((className) => {
                if (/^letter-\d+$/.test(className)) {
                    number = parseInt(className.split("-")[1]);
                }
            });

            if (event.key === 'Backspace' || event.key === 'Delete') {
                spanActive.textContent = "";
                delete mapTrys[number];
            } else if (/^[A-Za-z]$/.test(eventKey)) {
                let foundNumber: number | null = null;

                for (const [key, value] of Object.entries(mapTrys)) {
                    if (value === normalizeText(eventKey) && parseInt(key) !== number && number !== 0) {
                        foundNumber = parseInt(key);
                        const foundElements = document.querySelectorAll(`.letter-${foundNumber}`);
                        foundElements.forEach((el) => {
                            el.textContent = "";
                        });

                        delete mapTrys[foundNumber];
                    }
                }

                spanActive.textContent = eventKey.toUpperCase();
                mapTrys[number] = eventKey;
                setTrys(mapTrys);
            }
        });
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
                
                        } else {
                            tdActive.classList.add("bg-red-400");
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
                            }
                        }
                    });
                } else {
                    console.log("elemento não encontrado", letter);
                }
            });            
        });
    };
    

    const handleGenerateTips = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGenerateTips();
    }, [term]);

    return { data, solutions, handleKeyUp, generateAlphabetMap, resultArray, alphabetMap, term, loading, handleVerify, termTip, soltionsTips };
}
