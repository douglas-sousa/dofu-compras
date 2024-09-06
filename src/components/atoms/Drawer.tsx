import type { ReactNode } from "react";
import { twMerge } from 'tailwind-merge';

type DrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    overlay?: ReactNode;
}

export default function Drawer ({
    isOpen,
    onClose,
    children,
    overlay: providedOverlay,
}: DrawerProps) {

    function renderOverlay () {
        const overlay = providedOverlay
            ? providedOverlay
            : (
                <div
                    className="fixed top-0 left-0 w-full h-full z-40"
                    onClick={onClose}
                />
            );

        return isOpen && overlay;
    }

    return (
        <>
            <div
                className={twMerge(
                    "fixed top-0 right-0 w-96 h-full",
                    "bg-white shadow-xl translate-x-full",
                    "transition-all z-50 p-8",
                    isOpen && "translate-x-0"
                )}
            >
                <button
                    className="absolute top-8 right-2 cursor-pointer"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
            {renderOverlay()}
        </>
    )
}