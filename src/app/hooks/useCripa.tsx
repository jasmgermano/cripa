import { get } from 'http';
import React, { use, useEffect, useState } from 'react'

interface WordData {
    words: string[];
}

interface AllPagesResponse {
    batchcomplete?: string;
    continue?: {
        apcontinue: string;
        continue: string;
    };
    query: {
        allpages: Array<{
            pageid: number;
            ns: number;
            title: string;
        }>;
    };
}

export default function useCripa() {

    const [data, setData] = useState<WordData>({ words: [] });
    const [solutions, setSolutions] = useState<string[]>([]);
    const [alphabetMap, setAlphabetMap] = useState<{ [key: string] : number}>({});
    const [resultArray, setResultArray] = useState<number[][]>([]);
    const [Trys, setTrys] = useState<{ [key: number]: string }>({});
    const [term, setTerm] = useState<string>("");

    const fetchWordData = async () => {
        try {
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

    const getSolutions = () => {
        if (data.words.length > 0) {
            const randomWords = data.words.toSorted(() => Math.random() - 0.5).slice(0, 14);
            setSolutions(randomWords);
        }
    };

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

    const getTerm = async () => {
        const terms = await fetchTerms();
        const terms14letters = terms?.termos.filter((term: string) => {
            const lettersOnly = term.match(/[a-zA-ZÀ-ÿ]/g);
            return lettersOnly && lettersOnly.length === 14;
        });

        if (terms14letters.length > 0) {
            const randomIndex = Math.floor(Math.random() * terms14letters.length);
            setTerm(terms14letters[randomIndex]);
        }
    }

    useEffect(() => {
        fetchWordData();
        getTerm();
    }, []);


    useEffect(() => {
        if (data.words.length > 0) {
            getSolutions();
        }
    }, [data]);

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
                for (const [key, value] of Object.entries(mapTrys)) { // transforma o objeto em array [chave, valor] e itera sobre ele
                    if (value === event.key && parseInt(key) !== number) {
                        foundNumber = parseInt(key);
                        const foundElements = document.querySelectorAll(`.letter-${foundNumber}`);
                        foundElements.forEach((element) => {
                            element.textContent = "";
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

    const generateAlphabetMap = () => {
        const alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
        const map: { [key: string]: number } = {};
        const numbers = Array.from( { length:26 }, ( _ , i ) => i + 1);

        // embaralha o array de números
        const shuffle = (array: number[]) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // gera um indice aleatório entre 0 e i
                [array[i], array[j]] = [array[j], array[i]]; // troca os elementos de posição
            }
        };

        shuffle(numbers);

        alphabet.forEach((letter, index) => {
            map[letter] = numbers[index];
        });

        setAlphabetMap(map);
    };

    const compareLetters = (solution: string) => {
        if (Object.keys(alphabetMap).length === 0) {
            return;
        }
        const solutionArray = solution.toLowerCase().split("");
        const updateArray: number[] = [];
        
        solutionArray.forEach((solutionLetter, index) => {
            if (solutionLetter in alphabetMap) 
                updateArray.push(alphabetMap[solutionLetter]);
        });

        return updateArray;
    };

    useEffect(() => {
        if (solutions.length > 0 && Object.keys(alphabetMap).length > 0) {
            const result = solutions.map(compareLetters).filter((item) => item !== undefined);
            setResultArray(result);
        }
    }, [solutions, alphabetMap]);

        return { data, solutions, handleKeyUp, generateAlphabetMap, resultArray, alphabetMap, term };
    }
