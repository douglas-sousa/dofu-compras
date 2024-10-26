"use server";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import { Storage } from "@google-cloud/storage";
import type { Bucket } from "@/services/types";

const BUCKET_KEYFILE = path.join(process.cwd(), "./keys.json");
const storage = new Storage({
    keyFilename: BUCKET_KEYFILE,
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