import Link from "next/link";
import { twMerge } from "tailwind-merge";

import PostPreview, { 
    PostPreviewProps
} from "@/components/molecules/PostPreview";

type PostInTimelineProps = {
    post: PostPreviewProps;
}

export default function PostInTimeline ({ post }: PostInTimelineProps) {
    function renderTimelinePoint () {
        return (
            <span className={twMerge(
                "select-none z-10"
            )}>
                <span
                    className="relative text-4xl text-white"
                    style={{ textShadow: "0 0 black" }}    
                >
                    ⚈
                    <span className={twMerge(
                        "absolute text-2xl text-blue-500",
                        "top-[10%] left-[17%]",
                    )}>
                        ⚈
                    </span>
                </span>
            </span>
        );
    }

    function renderPostArrow () {
        return post.side && (
            <span
                className={twMerge(
                    "text-white text-3xl select-none",
                    post.side === "right" && "rotate-180 -mr-1",
                    post.side === "left" && "-ml-1",
                )}
            >
                ▶
            </span>
        );
    }

    return (
        <div className={twMerge(
            "flex items-center",
            post.side === "left" && "ml-[1.6rem]",
            post.side === "right" && "flex-row-reverse mr-5"
        )}>
            <Link
                scroll={false}
                href={{
                    query: { post: post.id }
                }}
            >
                <PostPreview
                    {...post}
                    className={twMerge(
                        "my-4",
                    )}
                />
            </Link>
            {renderPostArrow()}
            {renderTimelinePoint()}
            <div
                className={twMerge(
                    "border-l-8 border-solid border-gray-300 h-64",
                    "absolute left-1/2"
                )}
            />
        </div>
    );
}