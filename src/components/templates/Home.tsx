"use client";
import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import DeletionPopup from "@/components/molecules/DeletionPopup";
import PostViewer from "@/components/organisms/PostViewer";
import PostInTimeline from "@/components/organisms/PostInTimeline";
import PostCreation from "@/components/organisms/PostCreation";
import { usePostDelete, usePostQueryParams } from "@/services/hooks";
import { formatPostPreview } from "@/services/utils";
import type { Frontend } from "@/services/types";

type HomeProps = {
    posts: Frontend.Post[];
}

export default function Home ({ posts }: HomeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [postIdToManage, setPostIdToManage] = useState<null | number>(null);

    const {
        searchParams,
        queryPost,
        queryImageInZoom
    } = usePostQueryParams(posts);

    function onPopupClose () {
        setPostIdToManage(null);
        setIsOpen(false);
    }

    const {
        isProcessing: isDeletingPost,
        delete: deletePostById
    } = usePostDelete({
        onFulfilled: onPopupClose,
        onRejected: console.error
    });

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8 pt-12">
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
                        post={formatPostPreview(post, index)}
                        deleteButton={(
                            <button
                                className="text-2xl text-red-500 mt-20"
                                onClick={() => {
                                    setPostIdToManage(post.id);
                                    setIsOpen(true);
                                }}
                            >
                                🗑
                            </button>
                        )}
                    />
                ))}
            </div>

            <Link
                className={twMerge(
                    "bg-dofu-primary text-white py-4 px-6",
                    "rounded-full text-xl fixed bottom-4 left-4 shadow-md"
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

            <DeletionPopup
                isOpen={isOpen}
                isDeleting={isDeletingPost}
                onPopupClose={onPopupClose}
                onDelete={() => deletePostById(String(postIdToManage))}
                title="Dejesa mesmo deletar essa postagem?"
            />
        </main>
    );
}