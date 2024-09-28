"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as database from "@/services/database";
import * as bucket from "@/services/bucket";
import {
    fromRowToFrontendPost,
    upsertAndGetUserCookie
} from "@/services/utils";

export async function getPosts () {
    try {
        const rawPosts = await database.selectPosts();
        return { posts: rawPosts.map(fromRowToFrontendPost) };
    } catch {
        return { posts: [] };
    }
}

export async function createPost (formdata: FormData) {
    const username = await upsertAndGetUserCookie(
        cookies(),
        () => database.insertUser({
            salt: (formdata.get("description") as string)
                .trim()
                .at(-1)!
        })
    );

    const row = await database.insertPost({
        userId: username,
        postToCreate: {
            date: new Date(),
            description: formdata.get("description") as string,
            title: formdata.get("title") as string
        }
    });

    const images = [
        formdata.get("images.0") as File,
        formdata.get("images.1") as File,
        formdata.get("images.2") as File
    ].filter((currentFile) => currentFile.size > 0);

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