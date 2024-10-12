import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import type { Frontend } from "@/services/types";

export function usePostQueryParams (posts: Frontend.Post[]) {
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
            const imageIndex = Number(searchParams.get("image")) - 1;
            return queryPost?.images[imageIndex];
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
    
    return {
        queryPost,
        queryImageInZoom,
        searchParams
    };
}