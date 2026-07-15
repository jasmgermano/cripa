'use client';

import { useEffect, useRef, useState } from "react";
import Logo from "@/assets/logo.svg";
import Star from "@/assets/star.svg";
import Modal from "@/components/modal";

interface DailyResultShareProps {
  dailyId: string | null;
  elapsedSeconds: number;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = hours > 0 ? [hours, minutes, seconds] : [minutes, seconds];
  return parts.map((part) => String(part).padStart(2, "0")).join(":");
};

const formatDate = (dailyId: string | null) => {
  if (!dailyId) return "";
  const [year, month, day] = dailyId.split("-");
  return `${day}/${month}/${year}`;
};

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
  context.stroke();
};

const loadImage = (source: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Não foi possível carregar a imagem ${source}.`));
    image.src = source;
  });

const drawResultImage = async (
  canvas: HTMLCanvasElement,
  elapsedSeconds: number,
  dailyId: string | null,
) => {
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = 1200;
  const height = 630;
  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#F2ECDF";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "#4F4F46";
  context.lineWidth = 8;
  context.strokeRect(18, 18, width - 36, height - 36);

  const [logo, star] = await Promise.all([loadImage(Logo.src), loadImage(Star.src)]);
  context.drawImage(logo, 450, 48, 300, 119);
  context.drawImage(star, 75, 65, 82, 82);
  context.drawImage(star, 1043, 65, 82, 82);
  context.drawImage(star, 105, 475, 64, 64);
  context.drawImage(star, 1031, 475, 64, 64);

  context.fillStyle = "#4F4F46";
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.font = "800 30px Arial, sans-serif";
  context.fillText(`★  DESAFIO DIÁRIO  •  ${formatDate(dailyId)}  ★`, width / 2, 218);

  context.fillStyle = "#EE9DC3";
  context.strokeStyle = "#4F4F46";
  context.lineWidth = 6;
  drawRoundedRect(context, 325, 260, 550, 165, 30);

  context.fillStyle = "#4F4F46";
  context.font = "800 22px Arial, sans-serif";
  context.fillText("MEU TEMPO", width / 2, 300);
  context.font = "900 90px Arial, sans-serif";
  context.fillText(formatTime(elapsedSeconds), width / 2, 365);

  context.font = "700 31px Arial, sans-serif";
  context.fillText("Eu resolvi o criptograma de hoje!", width / 2, 485);
  context.font = "600 25px Arial, sans-serif";
  context.fillText("Você consegue fazer melhor?", width / 2, 530);
};

const getCanvasBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Não foi possível gerar a imagem."));
    }, "image/png");
  });

export default function DailyResultShare({ dailyId, elapsedSeconds }: Readonly<DailyResultShareProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [feedback, setFeedback] = useState("");
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!isShareModalOpen || !canvasRef.current) return;

    drawResultImage(canvasRef.current, elapsedSeconds, dailyId).catch((error) => {
      console.error(error);
      setFeedback("Não foi possível gerar a imagem.");
    });
  }, [dailyId, elapsedSeconds, isShareModalOpen]);

  const shareOnTwitter = () => {
    const text = `eu resolvi um criptograma em ${formatTime(elapsedSeconds)} minutos! você acha que consegue fazer melhor? ★!🔗`;
    const params = new URLSearchParams({ text, url: window.location.origin });
    window.open(`https://twitter.com/intent/tweet?${params.toString()}`, "_blank", "noopener,noreferrer");
  };

  const copyImage = async () => {
    try {
      if (!canvasRef.current || !navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("Seu navegador não permite copiar imagens.");
      }

      const blob = await getCanvasBlob(canvasRef.current);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setFeedback("Imagem copiada!");
    } catch (error) {
      console.error(error);
      setFeedback("Não foi possível copiar. Use o botão Baixar imagem.");
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `cripa-diario-${dailyId ?? "resultado"}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
    setFeedback("Imagem baixada!");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFeedback("");
          setShareModalOpen(true);
        }}
        className="rounded-full border-2 border-custom-gray bg-custom-pink px-5 py-2 font-bold shadow-custom"
      >
        Compartilhar resultado
      </button>

      <Modal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} color="custom-pink">
        <section aria-labelledby="share-result-title">
          <h3 id="share-result-title" className="pr-7 text-center text-xl font-black">
            Compartilhe seu resultado
          </h3>
          <p className="mt-1 text-center text-sm">
            Publique seu tempo e, se quiser, adicione esta imagem ao post.
          </p>

          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Imagem do resultado do desafio diário: ${formatTime(elapsedSeconds)}`}
            className="mt-4 h-auto w-full rounded-xl border-2 border-custom-gray shadow-custom"
          >
            Resultado do desafio diário: {formatTime(elapsedSeconds)}.
          </canvas>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={shareOnTwitter}
              className="rounded-full border-2 border-custom-gray bg-custom-gray px-5 py-2 font-bold text-white shadow-custom"
            >
              Compartilhar no X
            </button>
            <button
              type="button"
              onClick={copyImage}
              className="rounded-full border-2 border-custom-gray bg-custom-pink px-5 py-2 font-bold shadow-custom"
            >
              Copiar imagem
            </button>
            <button
              type="button"
              onClick={downloadImage}
              className="rounded-full border-2 border-custom-gray bg-custom-beige px-5 py-2 font-bold shadow-custom"
            >
              Baixar imagem
            </button>
          </div>
          <p className="mt-3 min-h-5 text-center text-sm font-bold" aria-live="polite">
            {feedback}
          </p>
        </section>
      </Modal>
    </>
  );
}
