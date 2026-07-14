'use client';

import Logo from "@/assets/logo.svg";
import Star from "@/assets/star.svg";
import Footer from "@/components/footer";
import InstructionsModal from "@/components/instructionsModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const previewCells = [
  { number: "12", letter: "C", color: "bg-custom-beige" },
  { number: "7", letter: "R", color: "bg-custom-pink" },
  { number: "19", letter: "I", color: "bg-custom-beige" },
  { number: "4", letter: "P", color: "bg-custom-green" },
  { number: "2", letter: "A", color: "bg-custom-beige" },
];

export default function Home() {
  const [isInstructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-custom-green text-custom-gray items-center">
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12">

        <section className="relative grid w-full overflow-hidden rounded-[2rem] border-2 border-custom-gray bg-custom-beige shadow-custom lg:grid-cols-2 lg:gap-10 lg:px-12">
          <Image
            src={Star}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-5 h-6 w-6 rotate-12 sm:left-8 sm:top-8 sm:h-8 sm:w-8"
          />
          <Image
            src={Star}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 right-5 h-6 w-6 -rotate-12 sm:bottom-8 sm:right-8 sm:h-10 sm:w-10"
          />
          <div className="flex w-full flex-col items-center justify-center px-7 py-10 text-center sm:px-12 sm:py-12 lg:px-0">
            <Image
              src={Logo}
              alt="Cripa"
              priority
              className="mb-7 h-auto w-48 sm:w-64"
            />

            <h1 className="max-w-lg text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Decifre as pistas. Revele o segredo.
            </h1>
            <p className="mt-5 max-w-md text-base font-semibold leading-relaxed sm:text-lg">
              Cada número esconde uma letra. Use a lógica para completar as palavras e descobrir o desafio oculto.
            </p>

            <div className="mt-8 flex w-full max-w-md flex-col justify-center gap-3">
              <Link
                href="/jogo?modo=diario"
                className="group rounded-full border-2 border-custom-gray bg-custom-pink px-7 py-4 text-center shadow-custom transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-gray"
              >
                <span className="flex items-center justify-center gap-2 font-black">
                  <span aria-hidden="true">★</span>
                  Desafio diário
                  <span aria-hidden="true">★</span>
                </span>
              </Link>
              <Link
                href="/jogo"
                className="flex-1 rounded-full border-2 border-custom-gray bg-custom-green px-6 py-3 text-center font-bold shadow-custom transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-gray"
              >
                Novo desafio
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[350px] items-center justify-center px-7 pb-10 sm:px-12 sm:pb-12 lg:min-h-[520px] lg:px-0 lg:py-10">
            <div className="w-full max-w-md -rotate-2 rounded-2xl border-2 border-custom-gray bg-custom-pink p-5 shadow-custom sm:p-7">
              <div className="mb-5 rounded-xl border-2 border-custom-gray bg-custom-beige px-4 py-3 text-left text-sm font-bold shadow-custom">
                Dica: jogo de criptograma cheio de personalidade
              </div>

              <div className="grid grid-cols-5 overflow-hidden rounded-lg border-2 border-custom-gray bg-custom-beige shadow-custom">
                {previewCells.map((cell) => (
                  <div
                    key={cell.number}
                    className={`flex aspect-square flex-col border-r-2 border-custom-gray p-1 last:border-r-0 ${cell.color}`}
                  >
                    <span className="text-left text-[10px] font-bold sm:text-xs">{cell.number}</span>
                    <span className="flex flex-1 items-center justify-center text-2xl font-black sm:text-4xl">{cell.letter}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-bold sm:text-sm">
                <span className="rounded-full border-2 border-custom-gray bg-custom-beige px-3 py-1">14 palavras</span>
                <span className="rounded-full border-2 border-custom-gray bg-custom-beige px-3 py-1">dicas criativas</span>
                <span className="rounded-full border-2 border-custom-gray bg-custom-beige px-3 py-1">1 segredo</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <button
        type="button"
        className="w-auto mb-2 rounded-full border-2 border-custom-gray bg-custom-beige px-6 py-3 font-bold shadow-custom transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-gray"
        onClick={() => setInstructionsOpen(true)}
      >
        Como jogar
      </button>
      <Footer haveBgColor={true} showTipsWarning={false} />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
    </div>
  );
}
