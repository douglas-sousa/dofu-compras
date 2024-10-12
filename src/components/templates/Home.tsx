"use client";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import PostViewer from "@/components/organisms/PostViewer";
import PostInTimeline from "@/components/organisms/PostInTimeline";
import PostCreation from "@/components/organisms/PostCreation";
import type { Frontend } from "@/services/types";
import { usePostQueryParams } from "@/services/hooks";

type HomeProps = {
    posts: Frontend.Post[];
    username: string;
}

export default function Home ({ posts, username }: HomeProps) {
    const {
        searchParams,
        queryPost,
        queryImageInZoom
    } = usePostQueryParams(posts);

    console.log(posts);

    function formatPostPreview (postToFormat: Frontend.Post, index: number) {
        return {
            ...postToFormat,
            preview: postToFormat.description.length <= 69
                ? postToFormat.description
                : postToFormat.description.slice(0, 66).padEnd(69, "."),
            title: postToFormat.title.length <= 21
                ? postToFormat.title
                : postToFormat.title.slice(0, 18).padEnd(21, "."),
            side: index % 2
                ? "right" as const
                : "left" as const
        };
    }

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8">
            <Text
                variant="h1"
                className="text-center"
            >
                Registros de compras
            </Text>

            <Text
                variant="h2"
                className="w-max mx-auto text-orange-500"
            >
                ☺
                {" "}
                {username}
            </Text>

            <div className="pt-16 mx-auto w-[55.382rem]">
                {posts.map((post, index) => (
                    <PostInTimeline
                        key={post.id}
                        post={formatPostPreview(post, index)}
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