import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Drawer from "@/components/atoms/Drawer";
import Carousel from "@/components/molecules/Carousel";
import type { Frontend } from "@/services/types";

type PostViewerProps = {
    isOpen: boolean;
    post?: Frontend.Post;
    imageInZoom?: string;
}

export default function PostViewer ({
    isOpen,
    post,
    imageInZoom
}: PostViewerProps) {

    function onImageClick (imageIndex: number) {
        const url = new URL(window.location.href);    
        url.searchParams.delete("image");
        url.searchParams.append("image", String(imageIndex + 1));
        window.history
            .replaceState({}, document.title, url.pathname + url.search);    
    }

    function onImageClose () {
        const url = new URL(window.location.href);    
        url.searchParams.delete("image");
        window.history
            .replaceState({}, document.title, url.pathname + url.search);
    }

    function onDrawerClose () {
        window.history.replaceState(
            {},
            document.title,
            window.location.origin
        );
    }

    const paragraphs = post?.description.split("\r\n");
    
    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
            overlay={!!imageInZoom && (
                <div
                    className={twMerge(
                        "fixed top-0 left-0 size-full z-40",
                        "bg-black/50 p-8 backdrop-blur-sm"
                    )}
                    onClick={onDrawerClose}
                >
                    <button
                        className={twMerge(
                            "absolute top-2 left-4 cursor-pointer px-[0.3rem]",
                            "text-white z-40 bg-gray-400 hover:bg-gray-500",
                            "rounded-full"
                        )}
                        onClick={(event) => {
                            event.stopPropagation();
                            onImageClose();
                        }}
                    >
                        ✕
                    </button>
                    <div className="h-full w-[calc(100%-24rem)] relative">
                        <Image
                            key={imageInZoom}
                            src={imageInZoom}
                            alt="Imagem do produto"
                            fill
                            objectFit="contain"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                    </div>
                </div>
            )}
        >
            <div
                className="flex flex-col"
            >
                <Text
                    variant="h2"
                    className="max-h-14 overflow-y-auto"
                    title={post?.title}
                >
                    {post?.title}
                </Text>
                <hr className="bg-gray-200 my-4" />
                <section
                    className={twMerge(
                        "overflow-y-auto max-h-[calc(100vh-24.5rem)] min-h-16"
                    )}
                >
                    <Text
                        variant="h3"
                        className="text-gray-500"
                    >
                        Descrição
                    </Text>
                    {paragraphs?.map((eachParagraph, index) => (
                        <Text
                            key={index}
                            className="mt-4"
                        >
                            {eachParagraph}
                        </Text>
                    ))}
                </section>
                <hr className="bg-gray-200 my-4" />
                <section>
                    {!!post?.images.length && (
                        <>
                            <Text
                                variant="h3"
                                className="text-gray-500"
                            >
                                Imagens
                            </Text>
                            <Carousel
                                images={post?.images}
                                onImageClick={onImageClick}
                            />
                        </>
                    )}
                </section>
            </div>
        </Drawer>
    );
}