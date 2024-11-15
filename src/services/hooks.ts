import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createPost, deleteAccount, deletePostById } from "@/services/handlers";
import {
    validatePostFormData, type PostSubmitFail
} from "@/services/utils";
import type { Frontend, JSend } from "@/services/types";

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

        return () => {
            if (document.documentElement.style.overflowY) {
                document.documentElement.style.overflowY = "";
            }
        };
    }, [searchParams]);
    
    return {
        queryPost,
        queryImageInZoom,
        searchParams
    };
}

const INITIAL_FAILURE_STATE = {} as PostSubmitFail;

export function usePostSubmit ({ onFulfilled, onRejected }: {
    onFulfilled: (payload: JSend.Success<null>) => void,
    onRejected: (payload: PostSubmitFail | JSend.Error) => void
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [failureState, setFailureState] =
        useState(INITIAL_FAILURE_STATE);

    function done () {
        setIsProcessing(false);
    }

    function clearErrors () {
        setFailureState(INITIAL_FAILURE_STATE);
    }

    return {
        isProcessing,
        formState: { error: failureState, clearErrors },
        create: (formData: FormData) => {
            clearErrors();
            setIsProcessing(true);
            
            const requirement = validatePostFormData(formData);
            if (Object.values(requirement.data).length) {
                setFailureState(requirement);
                onRejected(requirement);
                return done();
            }

            createPost(formData)
                .then((requirement) => {
                    if (!requirement) {
                        return onFulfilled({
                            status: "success",
                            data: null
                        });
                    }

                    if (requirement.status === "fail") {
                        setFailureState(requirement);
                    }

                    onRejected(requirement);
                })
                .finally(done);
        }
    };
}

export function useAccountDelete ({ onRejected }: {
    onRejected: (payload: JSend.Error) => void
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    function done () {
        setIsProcessing(false);
    }

    return {
        isProcessing,
        delete: () => {
            setIsProcessing(true);

            deleteAccount()
                .then((response) => {
                    if (response?.status === "error") {
                        onRejected(response);
                    }
                })
                .finally(done);
        }
    };
}

export function usePostDelete ({ onFulfilled, onRejected }: {
    onFulfilled: (payload: JSend.Success<null>) => void,
    onRejected: (payload: JSend.Error) => void
}) {
    const [isProcessing, setIsProcessing] = useState(false);

    function done () {
        setIsProcessing(false);
    }

    return {
        isProcessing,
        delete: (postId: string) => {
            setIsProcessing(true);

            deletePostById(postId)
                .then((response) => {
                    if (response?.status === "error") {
                        onRejected(response);
                    } else {
                        onFulfilled({
                            status: "success",
                            data: null
                        });
                    }
                })
                .finally(done);
        }
    };
}