/* eslint-disable @typescript-eslint/no-namespace */
export namespace Frontend {
    export type Post = {
        title: string;
        description: string;
        date: Date;
        id: number;
        images: string[];
    };
}

export namespace Bucket {
    export type UploadedImage = {
        link: string;
    };
}

export namespace Database {
    export type ReturningRowPost = {
        id: number;
        title: string;
        description: string;
        datetime: string;
        user_id: string;
    }

    export type RowPost = {
        post_id: number;
        title: string;
        description: string;
        datetime: string;
        user_id: string;
        image_id: number;
        image_links: string;
    };
}

export namespace Utils {
    export type GenerateUsernameParams = {
        salt: string;
    }
}