"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import * as database from "@/services/database";
import * as bucket from "@/services/bucket";
import {
    fromRowToFrontendInsights,
    fromRowToFrontendPost,
    getUsernameFromCache,
    upsertUsernameIntoCache,
    validatePostFormData
} from "@/services/utils";
import { type JSend } from "./types";

async function createUser () {
    const entry = await database.insertUser();
    const username = entry.id;
    return username;
}

export async function getUser () {
    const websiteCookies = cookies();
    const username = getUsernameFromCache(websiteCookies);

    return {
        username,
        createdAt: new Date("2024-11-01T23:19:43.248Z"),
        expiresAt: new Date("2025-11-01T23:19:43.248Z")
    };
}

export async function getPosts () {
    try {
        const websiteCookies = cookies();
        const username = getUsernameFromCache(websiteCookies);
        const rawPosts = await database.selectPosts(username);
        return { posts: rawPosts.map(fromRowToFrontendPost) };
    } catch (error) {
        console.error(error);

        return { posts: [] };
    }
}

export async function createPost (formData: FormData) {
    const requirement = validatePostFormData(formData);
    if (Object.values(requirement.data).length) {
        return requirement;
    }

    try {
        const websiteCookies = cookies();
        let username = getUsernameFromCache(websiteCookies);
        if (!username) {
            username = await createUser();
        }
    
        upsertUsernameIntoCache(username, websiteCookies);
    
        const row = await database.insertPost({
            userId: username,
            postToCreate: {
                description: formData.get("description") as string,
                title: formData.get("title") as string
            }
        });
    
        const images = Array.from({ length: 3 })
            .map((_, index) => formData.get(`images.${index}`) as File)
            .filter((currentFile) => currentFile.size > 0);
    
        const uploadedImages = await Promise.all(images.map(
            (currentFile, index) =>
                bucket.uploadImage(currentFile, row.id, index)
        ));
    
        await Promise.all(uploadedImages.map((uImage) => {
            return database.insertImage({
                postId: row.id,
                imageLink: uImage.link
            });
        }));
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Erro inesperado."
        } satisfies JSend.Error;
    }


    revalidatePath("/");
    redirect("/");
}

export async function getInsights () {
    const websiteCookies = cookies();
    const username = getUsernameFromCache(websiteCookies);
    const rawInsights = await database.selectInsights(username);

    return fromRowToFrontendInsights(rawInsights);
}