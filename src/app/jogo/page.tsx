'use client';
import WordButton from "@/components/wordButton";
import useCripa from "@/hooks/useCripa";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import Star from "@/assets/star.svg";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Menu from "@/components/menu";
import Footer from "@/components/footer";
import InstructionsModal from "@/components/instructionsModal";

export default function Game() {
  const { solutions, processLetterInput, handleKeyUp, generateAlphabetMap, resultArray, termProgress, loading, handleVerify, soltionsTips, termTip, isAllCorrect, setIsAllCorrect, isMobile, currentCuriosity } = useCripa();
  const [isInstructionsOpen, setInstructionsOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const totalRows = solutions.length;
  const totalColumns = 8;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (focusedIndex === null || focusedRow === null) return;

    let newIndex = focusedIndex;
    let newRow = focusedRow;

    event.preventDefault();

    if (event.key === 'ArrowRight') {
      newIndex = (focusedIndex + 1) % totalColumns;
    } else if (event.key === 'ArrowLeft') {
      newIndex = (focusedIndex - 1 + totalColumns) % totalColumns;
    } else if (event.key === 'ArrowDown') {
      newRow = focusedRow + 1 < totalRows ? focusedRow + 1 : focusedRow;
    } else if (event.key === 'ArrowUp') {
      newRow = focusedRow > 0 ? focusedRow - 1 : focusedRow;
    } else {
      return;
    }

    setFocusedRow(newRow);
    setFocusedIndex(newIndex);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedIndex, focusedRow]);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  useEffect(() => {
    if (!isMobile)
      generateAlphabetMap();
  }, [isMobile]);

  useEffect(() => {
    setShowSuccessModal(isAllCorrect);
  });

  const toggleInstructions = () => {
    setInstructionsOpen(!isInstructionsOpen);
  };

  if (loading) {
    return (
      <div className="bg-custom-beige text-center p-10 h-screen w-full">
        <div className="h-full flex flex-col items-center justify-center animate-float gap-4">
          <a href="/"><Image src={Logo} alt="Imagem do logo com uma animação de flutuação" className="h-14 sm:h-20" /></a>
          {currentCuriosity && currentCuriosity.link ? (
            <p className="text-[10px] sm:text-lg font-semibold text-custom-gray leading-tight w-3/4">
              {currentCuriosity.text}
              <a href={currentCuriosity.link} target="_blank" rel="noreferrer" className="underline">{currentCuriosity.link}</a>
            </p>
          ) : (
            <p className="text-[10px] sm:text-lg font-semibold text-custom-gray leading-tight w-3/4">{currentCuriosity?.text}</p>
          )}
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-custom-gray fill-custom-beige" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen lg:h-auto">
      <Menu toggleInstructions={toggleInstructions} />
      <div className="sm:hidden flex justify-center mt-7">
        <button className="text-custom-gray font-bold sm:hidden" onClick={toggleInstructions}>
          Como Jogar
        </button>
      </div>
      <main className="flex flex-col items-center gap-10 px-3 py-6 sm:px-10 md:px-20 lg:px-48 lg:mt-5 pb-[calc(env(safe-area-inset-bottom)+350px)] sm:pb-10">
        <div className="hint-bar flex flex-col">
          <section className="w-full sm:px-4 sm:pt-3" aria-label="Progresso da palavra secreta">
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] sm:text-sm">
              Palavra secreta
            </p>
            <div
              className="mx-auto grid w-full max-w-lg gap-1 sm:gap-2"
              style={{ gridTemplateColumns: `repeat(${termProgress.length}, minmax(0, 1fr))` }}
            >
              {termProgress.map((letter, index) => (
                <span
                  key={index}
                  className={`flex h-6 min-w-0 items-center justify-center border-b-2 border-custom-gray text-[10px] font-bold sm:h-8 sm:text-sm ${letter ? "bg-custom-green" : ""}`}
                  aria-label={`Letra ${index + 1}${letter ? `: ${letter}` : ": ainda não preenchida"}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </section>

          <div className="py-4 text-center text-base sm:text-md flex flex-col sm:flex-row items-center">
            <span className="font-bold">Dica:&nbsp;</span>
            <span>{termTip[0]?.clue}</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <div className="sm:hidden flex justify-end mb-2">
            <svg className="mr-5" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14"><path fill="none" stroke="#4F4F46" strokeLinecap="round" strokeLinejoin="round" d="m13.478 11.832l-.46-2.757a2.573 2.573 0 0 0-2.961-2.114l-2.171.362l-.683-4.09a1.194 1.194 0 0 0-1.374-.98v0c-.65.108-1.09.723-.98 1.374l.894 5.36l-.363.133a1.715 1.715 0 0 0-.643 2.803l.184.19l.954.988M1.75.5L.5 1.75L1.75 3M.5 1.75h3M10.25.5l1.25 1.25L10.25 3m1.25-1.25h-3" strokeWidth="1" /></svg>
          </div>
          <table className="min-w-[700px] border-collapse border-2 border-custom-gray w-full bg-custom-beige shadow-custom">
            <tbody className="relative">
              {solutions.map((word, rowIndex) => (
                <tr key={`row-${word}-${rowIndex}`} className={`row-${rowIndex}`}>
                  <td className="border-2 border-custom-gray p-3 text-sm sm:text-md">
                    {soltionsTips[rowIndex]?.clue}
                  </td>
                  <WordButton
                    key={`button-${word}-${rowIndex}`}
                    id={rowIndex}
                    solution={word}
                    crypto={resultArray[rowIndex]}
                    highlight={rowIndex}
                    focusedIndex={focusedIndex}
                    focusedRow={focusedRow}
                    setFocus={(newRow: number, newIndex: number) => {
                      setFocusedRow(newRow);
                      setFocusedIndex(newIndex);
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isMobile && (
          <div className="fixed bottom-0 left-0 w-full bg-custom-beige border-t-2 border-custom-gray z-50 sm:hidden">
            <div className="flex flex-wrap justify-center gap-2 max-w-[500px] mx-auto p-3">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <button
                  key={letter}
                  className="w-9 h-9 bg-custom-gray text-white rounded font-bold border-2 border-custom-gray"
                  onClick={() => {
                    processLetterInput(letter);

                    if (focusedRow !== null && focusedIndex !== null) {
                      const nextIndex = (focusedIndex + 1) % totalColumns;
                      const nextRow =
                        nextIndex === 0 && focusedRow + 1 < solutions.length
                          ? focusedRow + 1
                          : focusedRow;

                      setFocusedRow(nextRow);
                      setFocusedIndex(nextIndex);
                    }
                  }}
                >
                  {letter}
                </button>
              ))}
              <button
                className="w-20 h-9 bg-custom-green text-white rounded font-bold border-2 border-custom-gray"
                onClick={() => processLetterInput(null)}
              >
                Apagar
              </button>
            </div>
            <Footer haveBgColor={false} />
          </div>
        )}

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
        <InstructionsModal isOpen={isInstructionsOpen} onClose={toggleInstructions} />
      </main>
      <div className="hidden sm:flex">
        <Footer haveBgColor={true} />
      </div>
    </div>
  );
}
