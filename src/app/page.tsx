'use client';
import WordButton from "@/components/wordButton";
import { useState, useEffect } from "react";
import useCripa from "./hooks/useCripa";

export default function Home() {
  const {solutions, handleKeyUp, generateAlphabetMap, resultArray, term} = useCripa();

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    console.log(resultArray);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    generateAlphabetMap();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-center">CRIPA</h1>
      <table className="border-collapse border-2 border-black w-full">
        <tbody>
          {solutions.map((word, index) => (
            <tr key={`row-${word}-${index}`} className="">
              <td className="border-2 border-black">Dica {index+1}</td>
                <WordButton key={`button-${word}-${index}`} id={index} solution={word} crypto={resultArray[index]} />
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-5">Verificar</button>
      <p className="text-center mt-5">Palavras: {solutions.join(", ")}</p>
      <p className="text-center mt-5">Termo: {term}</p>
    </div>
  );
}
