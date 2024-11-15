import React from 'react'

export default function footer() {
    return (
        <footer className="w-full text-center flex flex-col gap-4">
            <span className="hidden lg:block text-custom-gray font-bold">As dicas são geradas pelo gemini e podem não fazer sentido. Me avise se tiver algo errado!</span>
            <span className="text-custom-gray w-full py-2 bg-custom-green"><a href="/" className="underline">Cripa</a> ★ Desenvolvido por <a href="https://www.linkedin.com/in/jasmgermano/" className="underline">Jasmine</a></span>
        </footer>
    )
}
