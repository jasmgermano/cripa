import React, { useRef, useEffect } from 'react';

interface WordButtonProps {
  id: number;
  solution: string;
  crypto: { number: number, isTermLetter: boolean }[];
  highlight: number;
  focusedIndex: number | null;
  focusedRow: number | null;
  setFocus: (row: number, index: number) => void;
}

export default function WordButton({
  crypto,
  id,
  focusedIndex,
  focusedRow,
  setFocus
}: Readonly<WordButtonProps>) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Refs for buttons

  const handleWordSelection = (number: number, index: number) => {
    setFocus(id, index); // Update focus state in the parent component

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

      if (btnActive && !btnActive.classList.contains("active"))
        btnActive.classList.add("active");
    });
  };

  useEffect(() => {
    if (focusedRow === id && focusedIndex !== null) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedRow, focusedIndex]);

  return (
    <>
      {crypto &&
        crypto.length > 0 &&
        crypto.map((cell, index) => (
          <td
            key={index}
            className={`h-full border-2 border-custom-gray w-14 ${
              cell.isTermLetter ? 'bg-custom-green border-black' : ''
            }`}
            id={`td-${index}-row-${id}`}
          >
            {cell ? (
              <button
                ref={(el) => { buttonRefs.current[index] = el; }}
                className="w-full h-full flex flex-col items-center pb-2"
                onClick={() => handleWordSelection(cell.number, index)}
                onFocus={() => handleWordSelection(cell.number, index)}
                tabIndex={focusedRow === id && focusedIndex === index ? 0 : -1} 
              >
                <span className="text-xs text-left w-full pl-1">
                  {!cell.isTermLetter ? cell.number : '?'}
                </span>
                <span className={`text-xl h-7 letter-${cell.number} bg-none`}></span>
                <input type="text" className="hidden" id="hiddenInput" />
              </button>
            ) : (
              <span className="text-xs">-</span>
            )}
          </td>
        ))}
    </>
  );
}
