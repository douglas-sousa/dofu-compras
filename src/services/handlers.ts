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
    upsertUserIntoCache,
    validatePostFormData
} from "@/services/utils";
import { USER_COOKIE_KEY } from "./constants";
import { type JSend } from "./types";

async function createUser () {
    const entry = await database.insertUser();
    const createdAt = new Date(`${entry.created_at}Z`);
    const expiresAt = new Date(createdAt.valueOf());
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    return {
        id: entry.id,
        username: createdAt.getTime().toString(36),
        createdAt,
        expiresAt
    };
}

export async function getUser () {
    const websiteCookies = cookies();
    const user = getUserFromCache(websiteCookies);

    return {
        id: user?.id,
        username: user?.createdAt
            ? user.createdAt.getTime().toString(36)
            : undefined,
        createdAt: user?.createdAt,
        expiresAt: user?.expiresAt
    };
}

export async function getPosts () {
    try {
        const websiteCookies = cookies();
        const user = getUserFromCache(websiteCookies);
        const rawPosts = await database.selectPosts(user?.id);
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
    
        upsertUserIntoCache(user, websiteCookies);
    
        const row = await database.insertPost({
            userId: user.id,
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
        const rawInsights = await database.selectInsights(user?.id);
        return fromRowToFrontendInsights(rawInsights);
    } catch (error) {
        console.error(error);
        return { total: null, insights: null };
    }
}

export async function deleteAccount () {
    const websiteCookies = cookies();
    const user = getUserFromCache(websiteCookies);
    
    try {
        const { posts } = await getPosts();

        const promises = posts.map((eachPost) => {
            return eachPost.images.map(bucket.deleteImage);
        });

        await Promise.all(promises.flat());

        await database.deleteAccount(user?.id);
        websiteCookies.delete(USER_COOKIE_KEY);
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

export async function deletePostById (postId: string) {
    try {
        const { image_links } = await database.selectPostById(postId);
        const images = image_links.split(",");

        await database.deletePostById(postId);

        await Promise.all(images.map(bucket.deleteImage));

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