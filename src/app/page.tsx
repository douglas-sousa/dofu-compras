import Empty from "@/components/templates/Empty";
import Home from "@/components/templates/Home";
import { getPosts, getUser } from "@/services/handlers";

export default async function App () {
    const username = await getUser();
    const { posts } = await getPosts();

    if (!posts.length) {
        return (
            <Empty />
        );
    }

    return (
        <Home
            posts={posts}
            username={username!}
        />
    );
}