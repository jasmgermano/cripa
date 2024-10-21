interface ButtonProps {
    text: string;
    onClick: () => void;
    color?: string;
}


export default function Button({ text, onClick, color } : ButtonProps) {
    return (
        <button 
            className={`${color ? `bg-${color}` : 'bg-custom-green'} min-w-24 py-2 px-4 rounded-full shadow-custom border-2 border-custom-gray`}
            onClick={onClick}>
            {text}
        </button>
    )
}