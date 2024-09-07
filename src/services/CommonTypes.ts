// eslint-disable-next-line @typescript-eslint/no-namespace
namespace CommonTypes {
    export type Post = {
        title: string;
        description: string;
        date: Date;
        id: number;
        images: string[];
    };
}

export default CommonTypes;