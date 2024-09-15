"use server";
import path from "node:path";
import { createReadStream } from "node:fs";
import { Storage } from "@google-cloud/storage";
import type { Bucket } from "@/services/types";

const BUCKET_KEYFILE = path.join(process.cwd(), "./keys.json");
const storage = new Storage({
    keyFilename: BUCKET_KEYFILE,
    projectId: process.env.PROJECT_ID
});

export async function uploadImage ({
    filename
}: { filename: string }): Promise<Bucket.UploadedImage> {
    const fileName = filename;
    const filePath = path.join(process.cwd(), fileName);
    const bucket = storage.bucket(process.env.BUCKET_ID!);
    const bucketFile = bucket.file(fileName);

    return new Promise((resolve, reject) => {
        createReadStream(filePath)
            .pipe(bucketFile.createWriteStream({
                resumable: false,
                gzip: true
            }))
            .on("error", reject)
            .on("finish", async () => {
                await bucketFile.makePublic();
                resolve({
                    link: `https://storage.googleapis.com/${bucket.name}/${fileName}`
                });
            });
    });
}