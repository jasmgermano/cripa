import React, { useState } from 'react';

interface WordButtonProps {
    id: number;
    solution: string;
    crypto: { number: number, isTermLetter: boolean }[];
    highlight: number; // índice da letra para o termo vertical
}

export default function WordButton({ id, solution, crypto, highlight }: WordButtonProps) {
    const [isWordActive, setIsWordActive] = useState(true);
    const wordButtonArray = new Array(8).fill(0);

    const handleWordSelection = (number: number) => {
        setIsWordActive(!isWordActive);

        const wordElements = document.querySelectorAll(`.letter-${number}`);
        const currentActive = document.querySelectorAll(".active");

        currentActive.forEach((element) => {
            element.classList.remove("active");
        });

        wordElements.forEach((element) => {
            if (!element.classList.contains("active")) element.classList.add("active");
        });
    };

    // Verifica se `crypto` está definido e possui o tamanho esperado antes de acessar
    return (
        <>
            {crypto && crypto.length > 0 && wordButtonArray.map((_, index) => (
                <td key={index} className="border-2 border-custom-gray w-14">
                    {crypto[index] ? (
                        <button
                            className="w-full h-full flex flex-col items-center pb-2"
                            onClick={() => handleWordSelection(crypto[index].number)}
                            onFocus={() => handleWordSelection(crypto[index].number)}
                        >
                            <span className="text-xs text-left w-full pl-1">{!crypto[index].isTermLetter ? crypto[index].number : "?"}</span>
                            <span className={`text-xl h-7 letter-${crypto[index].number}`}></span>
                        </button>
                    ) : (
                        <span className="text-xs">-</span>
                    )}
                </td>
            ))}
        </>
    );
}
