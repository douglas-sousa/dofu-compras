import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Popup ({
    isOpen,
    onClose,
    children
}: PopupProps) {

    return (
        <>
            <div
                className={twMerge(
                    "fixed left-1/2 -translate-x-1/2 top-0 -translate-y-full",
                    "bg-white shadow-xl transition-all z-50 rounded-sm p-2",
                    "max-w-md min-w-64",
                    isOpen && "top-1/2 -translate-y-1/2"
                )}
            >
                <button
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
            {isOpen && (
                <div
                    className={twMerge(
                        "fixed top-0 left-0 w-full h-full z-40 bg-black/15"
                    )}
                    onClick={onClose}
                />
            )}
        </>
    );
}