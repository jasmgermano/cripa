'use client';
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '@/assets/logo.svg'

interface MenuProps {
    toggleInstructions: () => void;
}

export default function menu({ toggleInstructions }: MenuProps) {
    return (
        <menu className="relative h-10 bg-custom-green flex items-center justify-start">
            <div className="absolute top-10 transform -translate-y-1/2 flex justify-center items-center h-11 w-full">
                <Image src={Logo} alt="Logo" className="h-full" />
            </div>
            <ul className="hidden sm:flex justify-end text-center w-1/2 pr-20">
                <li className="z-10">
                    <button className="text-custom-gray font-bold" onClick={toggleInstructions}>
                        Como Jogar
                    </button>
                </li>
            </ul>
        </menu>
    )
}
