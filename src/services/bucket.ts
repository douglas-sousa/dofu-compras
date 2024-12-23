"use server";
import { Readable } from "node:stream";
import { Storage } from "@google-cloud/storage";
import type { ReadableStream } from "node:stream/web";
import type { Bucket } from "@/services/types";

const storage = new Storage({
    credentials: buildCredentials(),
    projectId: process.env.PROJECT_ID
});

export async function uploadImage (
    image: File,
    postId: number,
    imageIndex: number,
): Promise<Bucket.UploadedImage> {
    const bucket = storage.bucket(process.env.BUCKET_ID!);
    const bucketFile = bucket.file(`${postId}.${imageIndex + 1}.${image.name}`);

    return new Promise((resolve, reject) => {
        Readable.fromWeb(image.stream() as ReadableStream)
            .pipe(bucketFile.createWriteStream({
                resumable: false
            }))
            .on("error", reject)
            .on("finish", async () => {
                await bucketFile.makePublic();
                resolve({
                    link: `https://${process.env.BUCKET_DOMAIN}/${bucket.name}/${bucketFile.name}`
                });
            });
    });
}

export async function deleteImage (
    imageLink: string
) {
    const imageName = imageLink.split("/").at(-1);
    const bucket = storage.bucket(process.env.BUCKET_ID!);
    if (imageName) {
        return bucket.file(imageName).delete({ ignoreNotFound: true });
    }
}

function buildCredentials () {
    const jsonBuffer = Buffer.from(process.env.BUCKET_CREDENTIAL!, "base64");

    return JSON.parse(jsonBuffer.toString());
}