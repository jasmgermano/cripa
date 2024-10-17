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
            const btnActive = element.closest("td"); 

            if (btnActive) {
                btnActive.classList.remove("active");
            }
        });

        wordElements.forEach((element) => {
            const btnActive = element.closest("td");

            if (btnActive && !btnActive.classList.contains("active")) btnActive.classList.add("active");
        });
    };

    return (
        <>
            {crypto && crypto.length > 0 && wordButtonArray.map((_, index) => (
                <td 
                    key={index} 
                    className={`h-full border-2 border-custom-gray w-14 ${crypto[index] && crypto[index].isTermLetter ? "bg-custom-green border-black" : ""}`}
                >
                    {crypto[index] ? (
                        <button
                            className="w-full h-full flex flex-col items-center pb-2"
                            onClick={() => handleWordSelection(crypto[index].number)}
                            onFocus={() => handleWordSelection(crypto[index].number)}
                        >
                            <span className="text-xs text-left w-full pl-1">{!crypto[index].isTermLetter ? crypto[index].number : "?"}</span>
                            <span className={`text-xl h-7 letter-${crypto[index].number} bg-none`}></span>
                        </button>
                    ) : (
                        <span className="text-xs">-</span>
                    )}
                </td>
            ))}
        </>
    );
}
