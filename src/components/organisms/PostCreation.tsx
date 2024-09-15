import { useState, Fragment, useEffect, type ChangeEvent } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Drawer from "@/components/atoms/Drawer";
import Input from "@/components/molecules/Input";
import { createPost } from "@/services/handlers";

type PostCreationProps = {
    isOpen: boolean;
    onClose: () => void;
}

export default function PostCreation ({ isOpen, onClose }: PostCreationProps) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (images.length) {
            images.forEach((currentImage, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews((currentPreviews) => {
                        const newPreviews = [...currentPreviews];
                        newPreviews[index] = reader.result as string;
                        return newPreviews;
                    });
                };
                reader.readAsDataURL(currentImage);
            });
        }
    }, [images]);

    function handleImageInput (
        event: ChangeEvent<HTMLInputElement>,
        index: number
    ) {
        const file = event.target.files?.[0];

        if (!!file) {
            setImages((currentImages) => {
                const newImages = [...currentImages];
                newImages[index] = file;
                return newImages;
            });
        }
    }

    function handleImageDismiss (index: number) {
        setPreviews(previews
            .filter((_, previewIndex) => previewIndex !== index));
        setImages(images
            .filter((_, imageIndex) => imageIndex !== index));
    }

    function renderImageInput (index: number) {
        return (
            <>
                <input
                    hidden
                    type="file"
                    name={`images.${index}`}
                    id={`images.${index}`}
                    accept="image/*"
                    onChange={(event) => {
                        handleImageInput(event, index);
                    }}
                />
                <label
                    key={index}
                    className={twMerge(
                        "border-gray-200 border-solid border",
                        "rounded-sm w-20 h-14 cursor-pointer",
                        "flex items-center justify-center"
                    )}
                    htmlFor={`images.${index}`}
                >
                    +
                </label>
            </>
        );
    }

    function renderImagePreview (index: number) {
        return (
            <div
                className={twMerge(
                    "border-gray-200 border-solid border",
                    "rounded-sm w-20 h-14 relative"
                )}
            >
                <Image
                    fill
                    objectFit="contain"
                    alt={`Prévia da imagem ${index + 1}`}
                    src={previews[index]}
                    className="cursor-pointer"
                    onClick={() => handleImageDismiss(index)}
                />
            </div>
        );
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
        >
            <form action={createPost}>
                <Input
                    placeholder="Título do registro"
                    name="title"
                />
                <hr className="bg-gray-200 my-4" />
                <Input
                    isMultiline
                    placeholder="Descrição do registro"
                    className="max-h-[calc(100vh-23rem)] min-h-10"
                    maxLength={462}
                    name="description"
                />
                <hr className="bg-gray-200 my-4" />
                <div className="px-4">
                    <Text
                        className="text-gray-600 text-base mb-4"
                    >
                        Imagens do produto (máximo 3)
                    </Text>
                    <section
                        className="flex justify-between"
                    >
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Fragment key={index}>
                                <input
                                    hidden
                                    type="file"
                                    name={`images.${index}`}
                                    id={`images.${index}`}
                                    accept=".jpg,.png,.jpeg,.webp"
                                    onChange={(event) => {
                                        handleImageInput(event, index);
                                    }}
                                />
                                {!!previews[index] && renderImagePreview(index)}
                                {!previews[index] && renderImageInput(index)}
                            </Fragment>
                        ))}
                    </section>
                </div>
                <button
                    className={twMerge(
                        "bg-blue-500 text-white py-2 w-80",
                        "rounded-sm text-lg absolute bottom-4",
                        "right-1/2 translate-x-1/2"
                    )}
                >
                    Criar
                </button>
            </form>
        </Drawer>
    );
}