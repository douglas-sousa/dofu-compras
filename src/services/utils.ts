import { cookies } from "next/headers";

import type { Frontend, Database } from "@/services/types";
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

export function getUsernameFromCache () {
    const websiteCookies = cookies();

    if (websiteCookies.has(USER_COOKIE_KEY)) {
        const username = websiteCookies.get(USER_COOKIE_KEY)?.value;
        return username;
    }
}

export function upsertUsernameIntoCache (username: string) {
    const websiteCookies = cookies();

    websiteCookies.set(
        USER_COOKIE_KEY,
        username,
        {
            maxAge: 60 * 60 * 24 * 365,
            secure: process.env.NODE_ENV === "production",
            httpOnly: process.env.NODE_ENV === "production"
        }
    );
}