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
        } finally {
            setLoading(false);  // Termina o carregamento
        }
    };

    // Função para buscar as soluções
    const getSolutions = async () => {
        const term = await getTerm();
        const normalizedTerm = normalizeText(term ?? ""); // Normaliza o termo
        const termArray = normalizedTerm.split("").filter((char) => char.trim() !== "");
        let solutions: string[] = [];
        let availableWords = [...data.words];

        console.log(termArray);

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
        let mapTrys = { ...Trys };

        activeElements.forEach((element) => {
            const classList = element.classList;
            let number = 0;

            classList.forEach((className) => {
                if (/^letter-\d+$/.test(className)) {
                    number = parseInt(className.split("-")[1]);
                }
            });

            if (event.key === 'Backspace') {
                element.textContent = "";
                delete mapTrys[number];
            } else if (/^[A-Za-z]$/.test(event.key)) {
                let foundNumber: number | null = null;
                for (const [key, value] of Object.entries(mapTrys)) {
                    if (value === normalizeText(event.key) && parseInt(key) !== number) {
                        foundNumber = parseInt(key);
                        const foundElements = document.querySelectorAll(`.letter-${foundNumber}`);
                        foundElements.forEach((el) => {
                            el.textContent = "";
                        });

                        delete mapTrys[foundNumber];
                    }
                }

                element.textContent = event.key.toUpperCase();
                mapTrys[number] = event.key;
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
            console.log(solutionLetter, isTermLetter);
            
            if (solutionLetter in alphabetMap) {
                if (isTermLetter) {
                    console.log("uniqueIndexTerm", uniqueIndexTerm);
                    console.log("solutionLetter", solutionLetter);
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
                    console.log("letterIndexInSolution", letterIndexInSolution);
                    console.log("term[index]", term[index]);

                    return compareLetters(solution, letterIndexInSolution);
                })
                .filter((item) => item.length > 0);

            setResultArray(result as { number: number, isTermLetter: boolean }[][]);
        }
    }, [solutions, alphabetMap]);

    const handleVerify = () => {
        let checkedIndexes : number[] = [];
        let termWithoutSpaces = term.replace(/\s/g, "");
        
        solutions.forEach((solution, index) => {
            const element = document.querySelector(`.row-${index}`);
            const solutionArray = normalizeText(solution).split("");
            let termGuesses = [];
            
            
            solutionArray.forEach((letter, letterIndex) => {
                const indexInTerm = normalizeText(termWithoutSpaces.toLowerCase()).indexOf(normalizeText(letter?.toLowerCase() ?? ""));
                const elementsToCheck = element?.querySelectorAll(`.letter-${alphabetMap[letter.toLowerCase()]}`);

                console.log(letter, indexInTerm, elementsToCheck);
                if (indexInTerm === index) {
                    const elementToCheck = element?.querySelector(`.letter--${index + 1}`);
                    if (elementToCheck) {
                        elementToCheck.classList.add("bg-green-200");
                        checkedIndexes.push(indexInTerm);
                        
                        termWithoutSpaces = termWithoutSpaces.substring(0, indexInTerm) + " " + termWithoutSpaces.substring(indexInTerm + 1);
                        console.log("termWithoutSpaces", termWithoutSpaces);
                    }
                }

                if (elementsToCheck) {
                    elementsToCheck.forEach((elementToCheck) => {
                        if (elementToCheck.textContent === letter.toUpperCase()) {
                            elementToCheck.classList.add("bg-green-200");
                            termGuesses.push({ letter: letter, index: letterIndex });
                        } else {
                            elementToCheck.classList.add("bg-red-200");
                        }
                    });
                } else {
                    console.log("elemento não encontrado", letter);
                }
                
            });
        });
    }

    return { data, solutions, handleKeyUp, generateAlphabetMap, resultArray, alphabetMap, term, loading, handleVerify };
}
