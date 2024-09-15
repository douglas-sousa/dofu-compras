import type { Frontend, Database } from "@/services/types";

export function fromRowToFrontendPost (row: Database.RowPost): Frontend.Post {
    return {
        id: row.post_id,
        title: row.title,
        description: row.description,
        date: new Date(`${row.datetime}Z`),
        images: row.image_links.split(",")
    };
}