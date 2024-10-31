import {
    type ReadonlyRequestCookies
} from "next/dist/server/web/spec-extension/adapters/request-cookies";

import type { Frontend, Database, JSend } from "@/services/types";
import { USER_COOKIE_KEY } from "@/services/constants";

export function fromRowToFrontendPost (row: Database.RowPost): Frontend.Post {
    return {
        id: row.post_id,
        title: row.title,
        description: row.description,
        createdAt: new Date(`${row.created_at}Z`),
        images: row.image_links.split(",")
    };
}

export function generateUsername () {
    return Date.now().toString(36);
}

export function getUsernameFromCache (cookies: ReadonlyRequestCookies) {
    if (cookies.has(USER_COOKIE_KEY)) {
        const username = cookies.get(USER_COOKIE_KEY)?.value;
        return username;
    }
}

export function upsertUsernameIntoCache (
    username: string,
    cookies: ReadonlyRequestCookies,
) {
    cookies.set(
        USER_COOKIE_KEY,
        username,
        {
            maxAge: 60 * 60 * 24 * 365,
            secure: process.env.NODE_ENV === "production",
            httpOnly: process.env.NODE_ENV === "production"
        }
    );
}

export type PostSubmitFail = JSend.Fail<
    Partial<Record<"title" | "description" | "images", string>>
>;

export function validatePostFormData (formData: FormData) {
    const failure = { status: "fail", data: {} } as PostSubmitFail;

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