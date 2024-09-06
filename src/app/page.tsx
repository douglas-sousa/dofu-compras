import Text from "@/components/atoms/text";
import PostInTimeline from "@/components/organisms/PostInTimeline";

export default function Home () {
    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8">
            <Text variant="h1">
                Alguns registros de compras
            </Text>

            <div className="pt-16 mx-auto w-[55.382rem]">
                <PostInTimeline
                    post={{
                        title: "CD da 鬼頭明",
                        preview: "Ssdsl sldslds dsldlsd ldsldslds dlsdlsd",
                        date: new Date(),
                        side: "left"
                    }}
                />
                <PostInTimeline
                    post={{
                        title: "CD da 鬼頭明",
                        preview: "Ssdsl sldslds dsldlsd ldsldslds dlsdlsd",
                        date: new Date(),
                        side: "right"
                    }}
                />
                <PostInTimeline
                    post={{
                        title: "CD da 鬼頭明",
                        preview: "Ssdsl sldslds dsldlsd ldsldslds dlsdlsd",
                        date: new Date(),
                        side: "left"
                    }}
                />
                <PostInTimeline
                    post={{
                        title: "CD da 鬼頭明",
                        preview: "Ssdsl sldslds dsldlsd ldsldslds dlsdlsd",
                        date: new Date(),
                        side: "right"
                    }}
                />
            </div>
        </main>
    );
}