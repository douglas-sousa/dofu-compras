"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import PostViewer from "@/components/organisms/PostViewer";
import PostInTimeline from "@/components/organisms/PostInTimeline";
import PostCreation from "@/components/organisms/PostCreation";
import type { Frontend } from "@/services/types";

type HomeProps = {
    posts: Frontend.Post[];
}

export default function Home ({ posts }: HomeProps) {
    const searchParams = useSearchParams();

    const queryPost = searchParams.has("post")
        ? posts[Number(searchParams.get("post")) - 1]
        : undefined;

    const queryImageInZoom = searchParams.has("image")
        ? posts[Number(searchParams.get("post")) - 1]
            .images[Number(searchParams.get("image")) - 1]
        : undefined;

    useEffect(() => {
        if (searchParams.has("post")) {
            document.documentElement.style.overflowY = "hidden";
        } else {
            document.documentElement.style.overflowY = "";
        }
    }, [searchParams]);

    const [inCreation, setInCreation] = useState(false);

    function onPostCreationClick () {
        setInCreation(true);
    }

    function onDrawerClose () {
        setInCreation(false);
    }

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8">
            <Text
                variant="h1"
                className="text-center"
            >
                Registros de compras
            </Text>

            <div className="pt-16 mx-auto w-[55.382rem]">
                {posts.map((post, index) => (
                    <PostInTimeline
                        key={post.id}
                        post={{
                            ...post,
                            preview: post.description.length <= 85
                                ? post.description
                                : post.description.slice(0, 82).padEnd(85, "."),
                            side: index % 2
                                ? "right"
                                : "left"
                        }}
                    />
                ))}
            </div>

            <button
                className={twMerge(
                    "bg-blue-500 text-white py-4 px-6",
                    "rounded-full text-xl fixed bottom-4 left-4"
                )}
                onClick={onPostCreationClick}
            >
                +
            </button>

            <PostViewer
                isOpen={searchParams.has("post")}
                post={queryPost}
                imageInZoom={queryImageInZoom}
            />

            <PostCreation
                isOpen={inCreation}
                onClose={onDrawerClose}
            />
        </main>
    );
}