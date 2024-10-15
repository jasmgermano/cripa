'use client';
import WordButton from "@/components/wordButton";
import useCripa from "./hooks/useCripa";
import { useEffect } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Star from "@/assets/star.svg";

export default function Home() {
  const { solutions, handleKeyUp, generateAlphabetMap, resultArray, term, loading, handleVerify } = useCripa();

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    generateAlphabetMap();
  }, []);

  // Exibir um spinner ou mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="">
      <menu className="relative h-10 bg-custom-green">
        <div className="absolute top-10 transform -translate-y-1/2 flex justify-center items-center h-11 w-full">
          <Image src={Logo} alt="Logo" className="h-full" />
        </div>
      </menu>
      <main className="px-48 mt-16 flex flex-col gap-10">
        <div className="hint-bar">
          Dica!!!!!!!!!!
        </div>
        <table className="border-collapse border-2 border-custom-gray w-full bg-custom-beige shadow-custom">
          <tbody className="relative">
            {solutions.map((word, index) => (
              <tr key={`row-${word}-${index}`} className={`row-${index}`}>
                <td className="border-2 border-custom-gray">
                  Dica {index + 1}
                  {index === 0 && 
                    <div className="h-6 absolute mt-[3px] right-[436px]">
                      <svg width="auto" height="auto" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.1289 41.605L24.5014 44.7189L25.874 41.605L30.6868 30.6868L41.605 25.874L44.7189 24.5014L41.605 23.1289L30.6868 18.3162L25.8741 7.3951L24.5014 4.28036L23.1288 7.3951L18.3161 18.3161L7.3951 23.1288L4.28036 24.5014L7.3951 25.8741L18.3162 30.6868L23.1289 41.605Z" fill="#AACDA9" stroke="#4F4F46" stroke-width="3" stroke-miterlimit="10"/>
                      </svg>                      
                    </div>
                  }
                  {index === 6 && 
                    <div className="h-6 absolute mt-[3px] right-[436px]">
                      <svg width="auto" height="auto" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.1289 41.605L24.5014 44.7189L25.874 41.605L30.6868 30.6868L41.605 25.874L44.7189 24.5014L41.605 23.1289L30.6868 18.3162L25.8741 7.3951L24.5014 4.28036L23.1288 7.3951L18.3161 18.3161L7.3951 23.1288L4.28036 24.5014L7.3951 25.8741L18.3162 30.6868L23.1289 41.605Z" fill="#EE9DC3  " stroke="#4F4F46" stroke-width="3" stroke-miterlimit="10"/>
                      </svg>                      
                    </div>
                  }
                  {index === 12 && 
                    <div className="h-6 absolute mt-[3px] right-[436px]">
                      <svg width="auto" height="auto" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.1289 41.605L24.5014 44.7189L25.874 41.605L30.6868 30.6868L41.605 25.874L44.7189 24.5014L41.605 23.1289L30.6868 18.3162L25.8741 7.3951L24.5014 4.28036L23.1288 7.3951L18.3161 18.3161L7.3951 23.1288L4.28036 24.5014L7.3951 25.8741L18.3162 30.6868L23.1289 41.605Z" fill="#AACDA9" stroke="#4F4F46" stroke-width="3" stroke-miterlimit="10"/>
                      </svg>                      
                    </div>
                  }
                </td>
                <WordButton key={`button-${word}-${index}`} id={index} solution={word} crypto={resultArray[index]} highlight={index} />
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <button className="mt-5" onClick={handleVerify}>Verificar</button>
      <p className="text-center mt-5">Palavras: {solutions.join(", ")}</p>
      <p className="text-center mt-5">Termo: {term}</p>
    </div>
  );
}
