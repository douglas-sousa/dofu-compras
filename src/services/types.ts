/* eslint-disable @typescript-eslint/no-namespace */
export namespace Frontend {
    export type Post = {
        title: string;
        description: string;
        createdAt: Date;
        id: number;
        images: string[];
    }

    export type MonthInsights = {
        shortName: string;
        position: number;
        numberOfPostsMade: number;
    }
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
        created_at: string;
        user_id: string;
        image_id: number;
        image_links: string;
    }

    export type RowInsight = {
        month: string;
        number_of_posts_made: number;
        number_of_images_uploaded: number;
        total_number_of_posts: number;
    }
}

export namespace JSend {
    export type Success<T = unknown> = {
        status: "success";
        data: T;
    }

    export type Fail<T = unknown> = {
        status: "fail";
        data: T;
    }

    export type Error = {
        status: "error";
        message: string;
    }
}