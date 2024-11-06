"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import * as database from "@/services/database";
import * as bucket from "@/services/bucket";
import {
    fromRowToFrontendInsights,
    fromRowToFrontendPost,
    getUserFromCache,
    upsertUsernameIntoCache,
    validatePostFormData
} from "@/services/utils";
import { type JSend } from "./types";

async function createUser () {
    const entry = await database.insertUser();
    const createdAt = new Date(`${entry.created_at}Z`);
    const expiresAt = new Date(createdAt.valueOf());
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    return {
        username: entry.id,
        createdAt,
        expiresAt
    };
}

export async function getUser () {
    const websiteCookies = cookies();
    const user = getUserFromCache(websiteCookies);

    return {
        username: user?.username,
        createdAt: user?.createdAt,
        expiresAt: user?.expiresAt
    };
}

export async function getPosts () {
    try {
        const websiteCookies = cookies();
        const user = getUserFromCache(websiteCookies);
        const rawPosts = await database.selectPosts(user?.username);
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
        let user = getUserFromCache(websiteCookies);
        if (!user) {
            user = await createUser();
        }
    
        upsertUsernameIntoCache(user, websiteCookies);
    
        const row = await database.insertPost({
            userId: user.username,
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
    const user = getUserFromCache(websiteCookies);

    try {
        const rawInsights = await database.selectInsights(user?.username);
        return fromRowToFrontendInsights(rawInsights);
    } catch (error) {
        console.error(error);
        return { total: null, insights: null };
    }
}