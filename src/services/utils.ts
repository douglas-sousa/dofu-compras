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

export function fromRowToFrontendInsights (row: Database.RowInsight[]) {
    const total = {
        numberOfPostsMade: row[0].total_number_of_posts
    };

    const insights = Array.from({ length: 12 }).map((_, index) => {
        const monthPosition = index + 1;
        const fullMonthName = new Intl.DateTimeFormat("pt-BR", {
            month: "long"
        })  // year 0 because it's irrelevant data
            .format(new Date(0, index));

        const databaseMatch = row.find(
            (rInsight) => rInsight.month === String(monthPosition)
        );

        const formattedMonth = {
            position: monthPosition,
            numberOfPostsMade:
                databaseMatch?.number_of_posts_made || 0,
            numberOfImagesUploaded:
                databaseMatch?.number_of_images_uploaded || 0,
            fullName: fullMonthName
        };

        return formattedMonth;
    });

    return { total, insights };
}

export function getUserFromCache (cookies: ReadonlyRequestCookies) {
    if (cookies.has(USER_COOKIE_KEY)) {
        const user = cookies.get(USER_COOKIE_KEY)!.value;
        const parsedUser = JSON.parse(user);
        const createdAt = new Date(parsedUser.createdAt);

        return {
            id: parsedUser.id as string,
            username: createdAt.getTime().toString(36),
            createdAt,
            expiresAt: new Date(parsedUser.expiresAt)
        };
    }
}

type User = NonNullable<ReturnType<typeof getUserFromCache>>;

export function upsertUserIntoCache (
    user: User,
    cookies: ReadonlyRequestCookies,
) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const stringifiedUser = JSON.stringify({
        id: user.id,
        createdAt: user.createdAt,
        expiresAt
    });

    cookies.set(
        USER_COOKIE_KEY,
        stringifiedUser,
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