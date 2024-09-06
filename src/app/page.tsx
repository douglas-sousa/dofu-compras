/* eslint-disable max-len */
"use client"

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Drawer from "@/components/atoms/Drawer";
import PostInTimeline from "@/components/organisms/PostInTimeline";

const FAKE_ITEMS = [
    {
        title: "Modern Frozen Fish",
        description: "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
        date: new Date("2024, 02, 02"),
        id: 1,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Unbranded Granite Pizza",
        description: "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
        date: new Date("2024, 03, 07"),
        id: 2,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Bespoke Cotton Keyboard",
        description: "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
        date: new Date("2024, 03, 20"),
        id: 3,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Refined Metal Pants",
        description: "The Apollotech B340 is an affordable wireless mouse",
        date: new Date("2024, 06, 10"),
        id: 4,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    },
    {
        title: "Electronic Fresh Hat",
        description: "The beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients\n\nThe beautiful range of Apple Naturalé that has an exciting mix of natural ingredients. With the Goodness of 100% Natural Ingredients",
        date: new Date("2024, 08, 02"),
        id: 5,
        images: [
            "https://images.pexels.com/photos/10152063/pexels-photo-10152063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        ]
    }
];

export default function Home () {
    const searchParams = useSearchParams();

    const queryPost = searchParams.has("post")
        ? FAKE_ITEMS[Number(searchParams.get("post")) - 1]
        : null;

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8">
            <Text
                variant="h1"
                className="text-center"
            >
                Alguns registros de compras
            </Text>

            <div className="pt-16 mx-auto w-[55.382rem]">
                {FAKE_ITEMS.map((post, index) => (
                    <PostInTimeline
                        key={post.id}
                        post={{
                            ...post,
                            preview: post.description.length <= 85
                                ? post.description
                                : post.description.slice(0, 82).padEnd(85, '.'),
                            side: index % 2
                                ? "right"
                                : "left"
                        }}
                    />
                ))}
            </div>

            <Drawer
                isOpen={searchParams.has("post")}
                onClose={() => {
                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.origin
                    );
                }}
            >
                <div>
                    <section>
                        <Text variant="h2">
                            {queryPost?.title}
                        </Text>
                        <hr className="bg-gray-200 my-4" />
                        <Text
                            variant="h3"
                            className="text-gray-500"
                        >
                            Descrição
                        </Text>
                        {queryPost?.description.split("\n\n").map((paragraph, index) => (
                            <Text
                                key={index}
                                className={twMerge(index !== 0 && "mt-4")}
                            >
                                {paragraph}
                            </Text>
                        ))}
                        <hr className="bg-gray-200 my-4" />
                    </section>
                    <section>
                        <Text
                            variant="h3"
                            className="text-gray-500"
                        >
                            Imagens
                        </Text>
                        {queryPost?.images.map((imageSource) => (
                            <Image
                                key={imageSource}
                                src={imageSource}
                                alt="Imagem do produto"
                                width="320"
                                height="250"
                            />
                        ))}
                    </section>
                </div>
            </Drawer>
        </main>
    );
}