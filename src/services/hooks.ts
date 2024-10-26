import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createPost } from "@/services/handlers";
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

type FailPayload = {
    status: "fail";
    data: Record<string, string>;
}

type ErrorPayload = {
    status: "error";
    message: string;
    data?: Record<string, string>;
}

const INITIAL_FAILURE_STATE = {} as FailPayload | ErrorPayload;

export function usePostSubmit ({ onSuccess, onFailure }: {
    onSuccess: () => void,
    onFailure: (payload: FailPayload | ErrorPayload) => void
}) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [failureState, setFailureState] =
        useState<FailPayload | ErrorPayload>(INITIAL_FAILURE_STATE);

    function done () {
        setIsProcessing(false);
    }

    function clearErrors () {
        setFailureState(INITIAL_FAILURE_STATE);
    }

    function validateFormData (formData: FormData) {
        const failure: FailPayload = { status: "fail", data: {} };
    
        if (!formData.get("title")) {
            failure.data["title"] =  "Título é obrigatório";
        }

        if (!formData.get("description")) {
            failure.data["description"] =  "Descrição é obrigatório";
        }

        const images = Array.from({ length: 3 })
            .map((_, index) => formData.get(`images.${index}`) as File)
            .filter((currentFile) => currentFile?.size > 0);

        if (!images.length) {
            failure.data["images"] =  "Pelo menos 1 imagem é necessária";
        }

        return failure;
    }

    return {
        isProcessing,
        formState: { error: failureState, clearErrors },
        create: (formData: FormData) => {
            clearErrors();
            setIsProcessing(true);

            const requirement = validateFormData(formData);
            if (Object.values(requirement.data).length) {
                setFailureState(requirement);
                onFailure(requirement);
                return done();
            }

            createPost(formData)
                .then(onSuccess)
                .catch(onFailure)
                .finally(done);
        }
    };
}