import {
    type ReadonlyRequestCookies
} from "next/dist/server/web/spec-extension/adapters/request-cookies";

import type { Frontend, Database, Utils } from "@/services/types";
import { USER_COOKIE_KEY } from "@/services/constants";

export function fromRowToFrontendPost (row: Database.RowPost): Frontend.Post {
    return {
        id: row.post_id,
        title: row.title,
        description: row.description,
        date: new Date(`${row.datetime}Z`),
        images: row.image_links.split(",")
    };
}

function clamp (num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

function fromCharToNumber (str: string) {
    const unicodeValue = str.charCodeAt(0);
    const valueBetween0And12 = unicodeValue % 13;
    return valueBetween0And12;
}

function shuffle (str: string) {
    const arr = str.split("");
    const { length } = arr;

    for (let index = length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const temp = arr[index];
        arr[index] = arr[randomIndex];
        arr[randomIndex] = temp;
    }

    return arr.join("");
}

export function generateUsername ({ salt }: Utils.GenerateUsernameParams) {
    const addedRadix = fromCharToNumber(salt);
    const MIN_RADIX = 24;
    const MAX_RADIX = 36;

    const radix = clamp(
        MIN_RADIX + addedRadix,
        MIN_RADIX,
        MAX_RADIX
    );

    const username = Date.now().toString(radix);
    const paddedUsername = username.padEnd(10, String(fromCharToNumber(salt)));

    return shuffle(paddedUsername);
}

export async function upsertAndGetUserCookie (
    cookies: ReadonlyRequestCookies,
    createCookieOnDatabase: () => Promise<{ id: string }>,
) {
    let username = "";

    if (cookies.has(USER_COOKIE_KEY)) {
        username = cookies.get(USER_COOKIE_KEY)!.value;
    } else {
        const entry = await createCookieOnDatabase();
        username = entry.id;
    }

    cookies.set(
        USER_COOKIE_KEY,
        username,
        { maxAge: 60 * 60 * 24 * 365 }
    );

    return username;
}