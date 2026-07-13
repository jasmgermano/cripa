interface modalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    color?: string;
}

export default function Modal({ children, isOpen, onClose, color }: modalProps) {
    return (
        <>
            {isOpen && (
                <div className={`fixed inset-0 bg-${color} bg-opacity-50 flex items-center justify-center z-50 px-4 py-6 sm:px-6`}>
                    <div role="dialog" aria-modal="true" className="border-2 border-custom-gray bg-custom-beige shadow-custom p-6 rounded-lg relative w-full max-w-[800px] max-h-full overflow-y-auto mx-auto">
                        <button
                            type="button"
                            aria-label="Fechar"
                            className="absolute top-2 right-2"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
