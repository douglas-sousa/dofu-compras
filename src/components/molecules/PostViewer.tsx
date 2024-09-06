import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Drawer from "@/components/atoms/Drawer";

type PostViewerProps = {
    isOpen: boolean;
    post?: {
        title: string;
        description: string;
        date: Date;
        id: number;
        images: string[];
    };
    imageInZoom?: string;
}

export default function PostViewer ({
    isOpen,
    post,
    imageInZoom,
}: PostViewerProps) {

    function onImageClick (imageIndex: number) {
        const url = new URL(window.location.href);    
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

    const paragraphs = post?.description.split("\n\n");
    
    return (
        <Drawer
            isOpen={isOpen}
            onClose={onDrawerClose}
            overlay={!imageInZoom ? undefined : (
                <div
                    className={twMerge(
                        "fixed top-0 left-0 size-full z-40",
                        "bg-black/50 p-8"
                    )}
                    onClick={onDrawerClose}
                >
                    <button
                        className={twMerge(
                            "absolute top-2 left-2 cursor-pointer text-white"
                        )}
                        onClick={(event) => {
                            event.stopPropagation();
                            onImageClose();
                        }}
                    >
                        ✕
                    </button>
                    <Image
                        key={imageInZoom}
                        src={imageInZoom}
                        alt="Imagem do produto"
                        width="0"
                        height="0"
                        sizes="74vw"
                        style={{ width: '74%', height: 'auto' }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                </div>
            )}
        >
            <div>
                <Text variant="h2">
                    {post?.title}
                </Text>
                <hr className="bg-gray-200 my-4" />
                <Text
                    variant="h3"
                    className="text-gray-500"
                >
                    Descrição
                </Text>
                {paragraphs?.map((eachParagraph, index) => (
                    <Text
                        key={index}
                        className={twMerge(index !== 0 && "mt-4")}
                    >
                        {eachParagraph}
                    </Text>
                ))}
                <hr className="bg-gray-200 my-4" />
                <Text
                    variant="h3"
                    className="text-gray-500"
                >
                    Imagens
                </Text>
                {post?.images.map((imageSource, index) => (
                    <Image
                        key={imageSource}
                        src={imageSource}
                        alt={`Imagem ${index + 1} do produto`}
                        width="320"
                        height="250"
                        onClick={() => onImageClick(index)}
                    />
                ))}
            </div>
        </Drawer>
    );
}