"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Text from "@/components/atoms/Text";
import PostViewer from "@/components/organisms/PostViewer";
import PostInTimeline from "@/components/organisms/PostInTimeline";
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

            <PostViewer
                isOpen={searchParams.has("post")}
                post={queryPost}
                imageInZoom={queryImageInZoom}
            />
        </main>
    );
}