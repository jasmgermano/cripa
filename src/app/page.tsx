'use client';
import WordButton from "@/components/wordButton";
import useCripa from "../hooks/useCripa";
import { useEffect } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Star from "@/assets/star.svg";

export default function Home() {
  const { solutions, handleKeyUp, generateAlphabetMap, resultArray, term, loading, handleVerify, soltionsTips, termTip } = useCripa();

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
    return <div className="bg-custom-beige text-center p-10 h-screen w-full">
      <div className="h-full flex flex-col items-center justify-center animate-float gap-4">
        <Image src={Logo} alt="Imagem do logo com uma animação de flutuação" className="h-20" />
        <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-custom-gray fill-custom-beige" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="">
      <menu className="relative h-10 bg-custom-green">
        <div className="absolute top-10 transform -translate-y-1/2 flex justify-center items-center h-11 w-full">
          <Image src={Logo} alt="Logo" className="h-full" />
        </div>
      </menu>
      <main className="px-3 lg:px-48 mt-16 flex flex-col gap-10 justify-center items-center">
        <div className="hint-bar py-10 text-center">
          {termTip[0]?.clue}
        </div>
        <table className="border-collapse border-2 border-custom-gray w-full bg-custom-beige shadow-custom">
          <tbody className="relative">
            {solutions.map((word, index) => (
              <tr key={`row-${word}-${index}`} className={`row-${index}`}>
                <td className="border-2 border-custom-gray p-3">
                  {soltionsTips[index]?.clue}
                  {/* {index === 0 && 
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
                  } */}
                </td>
                <WordButton key={`button-${word}-${index}`} id={index} solution={word} crypto={resultArray[index]} highlight={index} />
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mb-10 bg-custom-green w-24 py-2 rounded-full shadow-custom border-2 border-custom-gray" onClick={handleVerify}>Verificar</button>
      </main>
    </div>
  );
}
