"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as database from "@/services/database";
import * as bucket from "@/services/bucket";
import {
    fromRowToFrontendPost
} from "@/services/utils";
import { USER_COOKIE_KEY } from "@/services/constants";

export async function getUser () {
    const websiteCookies = cookies();

    if (websiteCookies.has(USER_COOKIE_KEY)) {
        const username = websiteCookies.get(USER_COOKIE_KEY)!.value;
        return username;
    }
}

async function createUser () {
    const entry = await database.insertUser();
    const username = entry.id;
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
    let username = await getUser();
    if (!username) {
        username = await createUser();
    }

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