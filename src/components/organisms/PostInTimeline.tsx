import { twMerge } from 'tailwind-merge';

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
                "absolute top-1/2 -translate-y-1/2",
                "-right-16 select-none z-10"
            )}>
                <span className="relative text-4xl text-white">
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
                    "absolute text-white text-3xl select-none",
                    "top-1/2 -translate-y-1/2",
                    post.side === "left" && "-right-5",
                    post.side === "right" && "left-[120%] rotate-180",
                )}
            >
                ▶
            </span>
        );
    }

    return (
        <div className="relative w-fit">
            <PostPreview
                {...post}
                className={twMerge(
                    "my-4",
                    post.side === "right" && "translate-x-[125%]"
                )}
            />
            {renderPostArrow()}
            {renderTimelinePoint()}
            <div
                className={twMerge(
                    "border-l-8 border-solid border-gray-300 h-44",
                    "absolute top-1/2 -translate-y-1/2 -right-[3.3rem]"
                )}
            />
        </div>
    )
}