"use server";

import sqlite from "sqlite3";

import type { Database, Utils } from "@/services/types";
import { generateUsername } from "@/services/utils";


const database = new sqlite.Database(process.env.DATABASE_FILE!);

export async function insertUser (
    params: Utils.GenerateUsernameParams,
    retry = 0,
): Promise<RowUser> {
    const userId = generateUsername(params);

    return new Promise((resolve, reject) => {
        database.run("INSERT INTO Users (id) VALUES (?)", [userId], (error) => {
            if (error) {
                if (retry > 0) {
                    return reject(error);
                }

                console.log("WILL RETRY USER INSERT");
                return insertUser(params, retry + 1);
            }

            resolve({ id: userId });
        });
    });
}
export async function insertPost ({
    userId,
    postToCreate
}: CreatePostParams): Promise<Database.ReturningRowPost> {
    const replacement = [
        postToCreate.title,
        postToCreate.description,
        postToCreate.date.toISOString().slice(0, -5).replace("T", " "),
        userId
    ];

    return new Promise((resolve, reject) => {
        database.get(`
            INSERT INTO Posts (title, description, datetime, user_id) VALUES
            (?, ?, ?, ?) RETURNING *
        `, replacement, (error, row: Database.ReturningRowPost) => {
            if (error) {
                return reject(error);
            }

            resolve(row);
        });
    });
}

export async function insertImage ({
    postId,
    imageLink
}: CreateImageParams): Promise<RowImage> {
    const replacement = [
        postId,
        imageLink
    ];

    return new Promise((resolve, reject) => {
        database.get(`
            INSERT INTO Images (post_id, link) VALUES
            (?, ?) RETURNING *
        `, replacement, (error, row: RowImage) => {
            if (error) {
                return reject(error);
            }

            resolve(row);
        });
    });
}

export async function selectPosts (): Promise<Database.RowPost[]> {
    return new Promise((resolve, reject) => {
        database.all(`
            SELECT 
                Posts.id AS post_id,
                Posts.title,
                Posts.description,
                Posts.datetime,
                Posts.user_id,
                GROUP_CONCAT(DISTINCT Images.link) as image_links
            FROM 
                Posts
            LEFT JOIN 
                Images ON Posts.id = Images.post_id
            GROUP BY
                Posts.id
            ORDER BY
                Posts.datetime DESC
        `,
        (error, rows: Database.RowPost[]) => {
            if (error) {
                return reject(error);
            }

            resolve(rows);
        });
    });
}

// ----------------------------- TYPES -----------------------------

type CreatePostParams = {
    userId: string;
    postToCreate: {
        title: string;
        description: string;
        date: Date;
    }
}

type CreateImageParams = {
    postId: number;
    imageLink: string;
};

type RowUser = { id: string };

type RowImage = {
    id: number;
    post_id: number;
    link: string;
}