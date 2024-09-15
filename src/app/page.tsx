import Empty from "@/components/templates/Empty";
import Home from "@/components/templates/Home";
import { getPosts } from "@/services/handlers";

export default async function App () {
    const response = await getPosts();

    if (!response.posts.length) {
        return (
            <Empty />
        );
    }

    return (
        <Home posts={response.posts} />
    );
}