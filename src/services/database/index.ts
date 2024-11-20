import type { Database } from "@/services/types";

import * as pg from "./pg";
import * as sqlite from "./sqlite";

const DATABASE = {
    production: pg,
    development: sqlite,
    test: sqlite
};

const database = DATABASE[process.env.NODE_ENV];

export async function insertUser () {
    const userId = crypto.randomUUID();
    const params = [userId];
    const query = sql`
        INSERT INTO Users (id) VALUES (?) RETURNING *
    `;

    return database.get(query, params) as
        Promise<Database.RowUser>;
}

export async function insertPost ({
    userId,
    postToCreate
}: Database.CreatePostParams) {
    const params = [
        postToCreate.title,
        postToCreate.description,
        userId
    ];
    const query = sql`
        INSERT INTO Posts (title, description, user_id) VALUES
        (?, ?, ?) RETURNING *
    `;

    return database.get(query, params) as
        Promise<Database.ReturningRowPost>;
}

export async function insertImage ({
    postId,
    imageLink
}: Database.CreateImageParams) {
    const params = [
        postId,
        imageLink
    ];
    const query = sql`
        INSERT INTO Images (post_id, link) VALUES
        (?, ?) RETURNING *
    `;

    return database.get(query, params) as
        Promise<Database.RowImage>;
}

export async function selectPosts (
    userId?: string
) {
    const params = [userId];
    const query = sql`
        SELECT 
            Posts.id AS post_id,
            Posts.title,
            Posts.description,
            Posts.created_at,
            Posts.user_id,
            GROUP_CONCAT(DISTINCT Images.link) as image_links
        FROM 
            Posts
        LEFT JOIN 
            Images ON Posts.id = Images.post_id
        WHERE
            Posts.user_id = (?)
        GROUP BY
            Posts.id
        ORDER BY
            Posts.created_at DESC
    `;

    return database.all(query, params) as
        Promise<Database.RowPost[]>;
}

export async function selectInsights (
    userId?: string
) {
    const params = [userId];
    const query = sql`
        SELECT
            strftime('%m', Posts.created_at) AS month,
            COUNT(DISTINCT Posts.id) AS number_of_posts_made,
            COUNT(DISTINCT Images.id) AS number_of_images_uploaded,
            COUNT(DISTINCT TotalPosts.id) AS total_number_of_posts
        FROM
            Posts
        LEFT JOIN
            Images ON Posts.id = Images.post_id
        LEFT JOIN
            Posts AS TotalPosts ON TotalPosts.user_id = Posts.user_id
        WHERE
            Posts.user_id = (?)
        AND
            strftime('%Y', Posts.created_at) = strftime('%Y', 'now')
        GROUP
            BY month
        ORDER
            BY month;
    `;

    return database.all(query, params) as
        Promise<Database.RowInsight[]>;
}

export async function deleteAccount (
    userId?: string
): Promise<void> {
    const params = [userId];
    const query = sql`
        DELETE FROM Users WHERE Users.id = (?)
    `;

    return database.run(query, params);
}

export async function selectPostById (
    postId?: string
) {
    const params = [postId];
    const query = sql`
        SELECT 
            Posts.id AS post_id,
            Posts.title,
            Posts.description,
            Posts.created_at,
            Posts.user_id,
            GROUP_CONCAT(DISTINCT Images.link) as image_links
        FROM 
            Posts
        LEFT JOIN 
            Images ON Posts.id = Images.post_id
        WHERE
            Posts.id = (?)
        GROUP BY
            Posts.id
    `;

    return database.get(query, params) as
        Promise<Database.RowPost>;
}

export async function deletePostById (
    postId?: string
): Promise<void> {
    const params = [postId];
    const query = sql`
        DELETE FROM Posts WHERE Posts.id = (?)
    `;

    return database.run(query, params);
}

function sql ([query]: TemplateStringsArray) {
    if (process.env.NODE_ENV === "development") {
        return query;
    }

    const PLACEHOLDER = /\?/g;
    let count = 0;
    const transformedQuery = query
        // pg uses $number instead of ? for parameters
        .replace(PLACEHOLDER, () => `\$${count += 1}`)
        // pg uses string_agg instead of GROUP_CONCAT
        .replace(/GROUP_CONCAT\((.*)\)/g, "string_agg($1, ',')")
        // pg uses different date part extraction
        .replace(/'%m',/g, "MONTH FROM")
        .replace(/'%Y',/g, "YEAR FROM")
        .replace(/'now'/g, "CURRENT_TIMESTAMP")
        .replace(/strftime/g, "EXTRACT");

    return transformedQuery;
}