'use client';
import WordButton from "@/components/wordButton";
import useCripa from "../hooks/useCripa";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Star from "@/assets/star.svg";
import Button from "@/components/button";
import Modal from "@/components/modal";

export default function Home() {
  const { solutions, handleKeyUp, generateAlphabetMap, resultArray, loading, handleVerify, soltionsTips, termTip, isAllCorrect, setIsAllCorrect } = useCripa();
  const [isInstructionsOpen, setInstructionsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    generateAlphabetMap();
  }, []);

  useEffect(() => {
    setShowSuccessModal(isAllCorrect);
  });

  const toggleInstructions = () => {
    setInstructionsOpen(!isInstructionsOpen);
  };

  const instructionsData = [
    { number: '1', letter: 'V', bgClass: '' },
    { number: '2', letter: 'E', bgClass: 'bg-custom-pink' },
    { number: '3', letter: 'R', bgClass: '' },
    { number: '?', letter: 'M', bgClass: 'bg-custom-green' },
    { number: '2', letter: 'E', bgClass: 'bg-custom-pink' },
    { number: '5', letter: 'L', bgClass: '' },
    { number: '6', letter: 'H', bgClass: '' },
    { number: '7', letter: 'O', bgClass: '' },
  ];

  // Exibir um spinner ou mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <div className="bg-custom-beige text-center p-10 h-screen w-full">
      <div className="h-full flex flex-col items-center justify-center animate-float gap-4">
        <Image src={Logo} alt="Imagem do logo com uma animação de flutuação" className="h-20" />
        <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-custom-gray fill-custom-beige" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="">
      <menu className="relative h-10 bg-custom-green flex items-center justify-start">
        <div className="absolute top-10 transform -translate-y-1/2 flex justify-center items-center h-11 w-full">
          <Image src={Logo} alt="Logo" className="h-full" />
        </div>
        <ul className="flex justify-end text-center w-1/2 pr-20">
          <li className="z-10">
            <button className="text-custom-gray font-bold" onClick={toggleInstructions}>
              Como Jogar
            </button>
          </li>
          <li>
          </li>
        </ul>
      </menu>
      <main className="px-3 lg:px-48 mt-16 flex flex-col gap-10 justify-center items-center mb-10">
        <div className="hint-bar py-10 text-center">
          <span className="font-bold">Nos quadrados em destaque:&nbsp;</span>{termTip[0]?.clue}
        </div>
        <table className="border-collapse border-2 border-custom-gray w-full bg-custom-beige shadow-custom">
          <tbody className="relative">
            {solutions.map((word, index) => (
              <tr key={`row-${word}-${index}`} className={`row-${index}`}>
                <td className="border-2 border-custom-gray p-3">
                  {soltionsTips[index]?.clue}
                </td>
                <WordButton key={`button-${word}-${index}`} id={index} solution={word} crypto={resultArray[index]} highlight={index} />
              </tr>
            ))}
          </tbody>
        </table>
        <Button text="Verificar" onClick={handleVerify} />
        {showSuccessModal && (
          <Modal isOpen={isAllCorrect} onClose={() => setIsAllCorrect(false)} color="custom-green">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold">Parabéns!</h2>
              <Image src={Star} alt="Estrela" className="h-5 w-5" />
            </div>
            <p className="text-xl">🎉​ Divou! Você acertou todas as palavras! 🎉​</p>
            <div className="w-full flex justify-center mt-4">
              <Button text="Carregar novo jogo" color="custom-pink" onClick={() => window.location.reload()} />
            </div>
          </Modal>
        )}
        {isInstructionsOpen && (
          <Modal isOpen={isInstructionsOpen} onClose={toggleInstructions} color="custom-green">             
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold">Como Jogar</h2>
                <Image src={Star} alt="Fechar" className="h-5 w-5" />
              </div>
              <p>Cripa é um jogo do tipo criptograma, onde você deve decifrar palavras a partir de dicas e preencher as letras correspondentes.</p>
              <ul className="list-disc pl-5 pb-4">
                <li>Use as dicas para preencher as palavras na tabela.</li>
                <li>As casas com o mesmo número representam a mesma letra.</li>
                <table className="border-collapse border-2 border-custom-gray bg-custom-beige shadow-custom mt-4 w-3/5 mb-4">
                  <tbody>
                    <tr>
                      {instructionsData.map((cell, index) => (
                        <td key={index} className="h-full border-2 border-custom-gray w-10">
                          <div className={`w-full h-full flex flex-col items-center pb-2 ${cell.bgClass}`}>
                            <span className="text-xs text-left w-full pl-1">{cell.number}</span>
                            <span className="text-xl h-7 bg-none">{cell.letter}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <li>As casas destacadas (em verde) formam uma palavra da vertical.</li>
                <li>Não há diferenciação de letras com acentuação. Exemplo: "A" e "Á" são consideradas iguais.</li>
                <li>Ao preencher todas as palavras, clique em "Verificar". Onde estiver errado, as casas ficarão vermelhas.</li>
              </ul>
              <Button text="Fechar" onClick={toggleInstructions} />
          </Modal>
        )}
      </main>
      <footer className="w-full text-center flex flex-col gap-4">
        <span className="text-custom-gray font-bold">As dicas são geradas pelo gemini e podem não fazer sentido. Me avise se tiver algo errado!</span>
        <span className="text-custom-gray w-full py-2 bg-custom-green"><a href="/" className="underline">Cripa</a> ★ Desenvolvido por <a href="https://www.linkedin.com/in/jasmgermano/" className="underline">Jasmine</a></span>
      </footer>
    </div>
  );
}
