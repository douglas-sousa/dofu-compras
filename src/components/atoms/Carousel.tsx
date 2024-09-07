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

    return (
        <div
            className={twMerge(
                "w-full h-48 auto overflow-hidden",
                "flex justify-between mt-4 gap-4"
            )}
        >
            <button
                className={twMerge(
                    "bg-none border-none px-2 bg-gray-200 hover:bg-gray-300",
                    "cursor-pointer rounded-full self-center"
                )}
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
            <button
                className={twMerge(
                    "bg-none border-none px-2 bg-gray-200 hover:bg-gray-300",
                    "cursor-pointer rounded-full self-center"
                )}
                onClick={goToNextImage}
            >
                ❯
            </button>
        </div>
    );
}