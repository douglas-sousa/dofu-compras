"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

    function getPostRequestedInURL () {
        if (searchParams.has("post")) {
            return posts.find((currentPost) =>
                currentPost.id === Number(searchParams.get("post"))
            );
        }
    }

    const queryPost = getPostRequestedInURL();

    function getImageRequestedInURL () {
        if (searchParams.has("image")) {
            return queryPost?.images[Number(searchParams.get("image")) - 1];
        }
    }

    const queryImageInZoom = getImageRequestedInURL();

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
                            preview: post.description.length <= 69
                                ? post.description
                                : post.description.slice(0, 66).padEnd(69, "."),
                            title: post.title.length <= 21
                                ? post.title
                                : post.title.slice(0, 18).padEnd(21, "."),
                            side: index % 2
                                ? "right"
                                : "left"
                        }}
                    />
                ))}
            </div>

            <Link
                className={twMerge(
                    "bg-blue-500 text-white py-4 px-6",
                    "rounded-full text-xl fixed bottom-4 left-4"
                )}
                scroll={false}
                href={{
                    query: { c: "" }
                }}
            >
                +
            </Link>

            <PostViewer
                isOpen={searchParams.has("post")}
                post={queryPost}
                imageInZoom={queryImageInZoom}
            />

            <PostCreation
                isOpen={searchParams.has("c")}
            />
        </main>
    );
}