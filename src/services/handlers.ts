"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as database from "@/services/database";
import * as bucket from "@/services/bucket";
import {
    fromRowToFrontendPost,
    getUsernameFromCache,
    upsertUsernameIntoCache
} from "@/services/utils";

async function createUser () {
    const entry = await database.insertUser();
    const username = entry.id;
    return username;
}

export async function getPosts () {
    try {
        const rawPosts = await database.selectPosts();
        return { posts: rawPosts.map(fromRowToFrontendPost) };
    } catch {
        return { posts: [] };
    }
}

export async function createPost (formdata: FormData) {
    let username = getUsernameFromCache();
    if (!username) {
        username = await createUser();
    }

    upsertUsernameIntoCache(username);

    const row = await database.insertPost({
        userId: username,
        postToCreate: {
            description: formdata.get("description") as string,
            title: formdata.get("title") as string
        }
    });

    const images = Array.from({ length: 3 })
        .map((_, index) => formdata.get(`images.${index}`) as File)
        .filter((currentFile) => currentFile.size > 0);

    const uploadedImages = await Promise.all(images.map(
        (currentFile, index) => bucket.uploadImage(currentFile, row.id, index)
    ));

    await Promise.all(uploadedImages.map((uImage) => {
        return database.insertImage({
            postId: row.id,
            imageLink: uImage.link
        });
    }));

    revalidatePath("/");
    redirect("/");
}