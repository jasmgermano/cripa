'use client'
import useCripa from '@/app/hooks/useCripa';
import React, { useEffect, useState } from 'react'

interface WordButtonProps {
    id: number;
    solution: string;
    crypto: number[];
}

export default function wordButton({ id, solution, crypto }: WordButtonProps) {
    const [isWordActive, setIsWordActive] = useState(true);
    const wordButtonArray = new Array(8).fill(0); 

    const handleWordClick = (number: number) => {
        setIsWordActive(!isWordActive);

        const wordElements = document.querySelectorAll(`.letter-${number}`);

        const currentActive = document.querySelectorAll(".active");
        currentActive.forEach((element) => {
            element.classList.remove("active");
        });

        wordElements.forEach((element) => {
            if (!element.classList.contains("active"))
                element.classList.add("active");
        });
    }

    return (
        <>
            {crypto && wordButtonArray.map((_, index) => (
                <td key={index} className={`border border-black w-10`}>
                    <button className="w-full h-full flex flex-col items-center pb-2" onClick={() => handleWordClick(crypto[index])}>
                        <span className="text-xs text-left w-full pl-1">{crypto[index]}</span>
                        <span className={`text-xl h-7 letter-${crypto[index]}`}></span>
                    </button>
                </td>
            ))}
        </>
    )
}
