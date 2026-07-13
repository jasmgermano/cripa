'use client';

import Star from "@/assets/star.svg";
import Image from "next/image";
import Button from "./button";
import Modal from "./modal";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructionsData = [
  { number: "1", letter: "V", bgClass: "" },
  { number: "2", letter: "E", bgClass: "bg-custom-pink" },
  { number: "3", letter: "R", bgClass: "" },
  { number: "?", letter: "M", bgClass: "bg-custom-green" },
  { number: "2", letter: "E", bgClass: "bg-custom-pink" },
  { number: "5", letter: "L", bgClass: "" },
  { number: "6", letter: "H", bgClass: "" },
  { number: "7", letter: "O", bgClass: "" },
];

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} color="custom-green">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl font-bold">Como jogar</h2>
        <Image src={Star} alt="" className="h-5 w-5" />
      </div>
      <p>
        Cripa é um jogo do tipo criptograma, onde você deve decifrar palavras a partir de dicas e preencher as letras correspondentes.
      </p>
      <ul className="list-disc space-y-1 pl-5 pb-4">
        <li>Use as dicas para preencher as palavras na tabela.</li>
        <li>As casas com o mesmo número representam a mesma letra.</li>
      </ul>

      <div className="mb-5 overflow-x-auto pb-1">
        <table className="min-w-[420px] border-collapse border-2 border-custom-gray bg-custom-beige shadow-custom sm:min-w-0 sm:w-3/5">
          <tbody>
            <tr>
              {instructionsData.map((cell, index) => (
                <td key={`${cell.number}-${index}`} className="h-full w-10 border-2 border-custom-gray">
                  <div className={`flex h-full w-full flex-col items-center pb-2 ${cell.bgClass}`}>
                    <span className="w-full pl-1 text-left text-xs">{cell.number}</span>
                    <span className="h-5 text-sm sm:h-7 sm:text-xl">{cell.letter}</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <ul className="list-disc space-y-1 pl-5 pb-4">
        <li>As casas destacadas em verde formam uma palavra na vertical.</li>
        <li>Não há diferenciação de letras com acentuação. Exemplo: “A” e “Á” são consideradas iguais.</li>
        <li>Depois de preencher as palavras, clique em “Verificar”. As respostas incorretas ficarão vermelhas.</li>
      </ul>
      <Button text="Fechar" onClick={onClose} />
    </Modal>
  );
}
