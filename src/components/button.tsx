interface ButtonProps {
    text: string;
    onClick: () => void;
}


export default function Button({ text, onClick } : ButtonProps) {
    return (
        <button 
            className="bg-custom-green w-24 py-2 rounded-full shadow-custom border-2 border-custom-gray" 
            onClick={onClick}>
            {text}
        </button>
    )
}