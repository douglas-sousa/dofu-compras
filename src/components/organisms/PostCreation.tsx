import {
    useState, Fragment, useEffect, useRef,
    type ChangeEvent, type FormEvent
} from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Drawer from "@/components/atoms/Drawer";
import Spinner from "@/components/atoms/Spinner";
import Input from "@/components/molecules/Input";
import { usePostSubmit } from "@/services/hooks";

type PostCreationProps = {
    isOpen: boolean;
}

export default function PostCreation ({ isOpen }: PostCreationProps) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);

    const {
        create: createPost,
        isProcessing: isProcessingPost,
        formState
    } = usePostSubmit({
        onSuccess: () => {
            formRef.current?.reset();
            setImages([]);
            setPreviews([]);
        },
        onFailure: console.error
    });

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
        if (!formRef.current) return;

        function selected (_: unknown, resourceIndex: number) {
            return resourceIndex !== index;
        }

        const offset = 2;
        const inputFromImageIndex =
                formRef.current.elements[index + offset] as HTMLInputElement;

        inputFromImageIndex.value = "";

        setPreviews(previews.filter(selected));
        setImages(images.filter(selected));
    }

    function onDrawerClose () {
        window.history.replaceState(
            {},
            document.title,
            window.location.origin
        );
    }

    function renderImageHandler (index: number) {
        return (
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

    function handleSubmit (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        createPost(formData);
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
        >
            <form
                onSubmit={handleSubmit}
                ref={formRef}
            >
                <Input
                    placeholder="Título do registro"
                    name="title"
                    errorMessage={formState.error.data?.title}
                    onInput={formState.clearErrors}
                />
                <hr className="bg-gray-200 my-4" />
                <Input
                    isMultiline
                    placeholder="Descrição do registro"
                    className="max-h-[calc(100vh-23rem)] min-h-10"
                    maxLength={462}
                    name="description"
                    errorMessage={formState.error.data?.description}
                    onInput={formState.clearErrors}
                />
                <hr className="bg-gray-200 my-4" />
                <div className="px-4">
                    <Text
                        className="text-gray-600 text-base mb-4"
                    >
                        Imagens do produto (máximo 3)
                    </Text>
                    <section
                        className="flex justify-between relative"
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
                                        formState.clearErrors();
                                    }}
                                />
                                {!!previews[index] && renderImagePreview(index)}
                                {!previews[index] && renderImageHandler(index)}
                            </Fragment>
                        ))}
                        {!!formState.error.data?.images && (
                            <Text
                                className={twMerge(
                                    "absolute -bottom-5 right-0",
                                    "text-xs text-red-500"
                                )}
                            >
                                {formState.error.data.images}
                            </Text>
                        )}
                    </section>
                </div>
                <button
                    className={twMerge(
                        "bg-blue-500 text-white py-2 w-80",
                        "rounded-sm text-lg absolute bottom-4",
                        "right-1/2 translate-x-1/2",
                        "flex justify-center items-center gap-4"
                    )}
                >
                    {isProcessingPost && (
                        <Spinner
                            className="-ml-8"
                        />
                    )}
                    Criar
                </button>
            </form>
        </Drawer>
    );
}