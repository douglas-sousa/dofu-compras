import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

type CarouselProps = {
    images: string[];
    onImageClick: (index: number) => void;
}

export default function Carousel ({ images, onImageClick }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    function goToNextImage () {
        const hasReachedLastImage = currentIndex === (images.length - 1);
        const nextIndex = hasReachedLastImage
            ? 0
            : currentIndex + 1;

        setCurrentIndex(nextIndex);
    }

    function goToPreviousImage () {
        const hasReachedFirstImage = currentIndex === 0;
        const previousIndex = hasReachedFirstImage
            ? images.length - 1
            : currentIndex - 1;

        setCurrentIndex(previousIndex);
    }

    const BUTTON_STYLE = twMerge(
        "bg-none border-none px-2 bg-gray-300 hover:bg-gray-400",
        "cursor-pointer rounded-full self-center text-white",
        images.length === 1 && "pointer-events-none"
    );

    return (
        <div
            className={twMerge(
                "w-full h-52 auto overflow-hidden relative",
                "flex justify-between py-4 gap-4 select-none"
            )}
        >
            <button
                className={BUTTON_STYLE}
                onClick={goToPreviousImage}
            >
                ❮
            </button>
            <div className="relative flex-1">
                <Image
                    key={images[currentIndex]}
                    src={images[currentIndex]}
                    alt={`Imagem ${currentIndex + 1} do produto`}
                    fill
                    objectFit="contain"
                    className="cursor-pointer"
                    onClick={() => onImageClick(currentIndex)}
                />
            </div>
            <p
                className={twMerge(
                    "text-xs text-end absolute bottom-0 left-1/2",
                    "-translate-x-1/2"
                )}
            >
                    Imagem {currentIndex + 1} de {images.length}
            </p>
            <button
                className={BUTTON_STYLE}
                onClick={goToNextImage}
            >
                ❯
            </button>
        </div>
    );
}