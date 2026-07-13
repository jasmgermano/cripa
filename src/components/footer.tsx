import React from 'react'

interface FooterProps {
    haveBgColor: boolean;
    showTipsWarning?: boolean;
}

export default function Footer({ haveBgColor, showTipsWarning = true }: FooterProps) {
    return (
        <footer className="w-full text-center flex flex-col gap-4">
            {showTipsWarning && (
                <span className="text-sm sm:text-base text-custom-gray font-bold px-5">
                    As dicas são geradas pelo gemini e podem não fazer sentido. Me avise se tiver algo errado!
                </span>
            )}
            <span className={`text-custom-gray w-full py-2 ${haveBgColor ? "bg-custom-green" : ""}`}><a href="/" className="underline">Cripa</a> ★ Desenvolvido por <a href="https://www.linkedin.com/in/jasmgermano/" className="underline">Jasmine</a></span>
        </footer>
    )
}
