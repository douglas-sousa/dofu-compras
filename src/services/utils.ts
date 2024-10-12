import type { Frontend, Database } from "@/services/types";

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