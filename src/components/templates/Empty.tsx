"use client";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Text from "@/components/atoms/Text";
import PostCreation from "@/components/organisms/PostCreation";

export default function Empty () {
    const searchParams = useSearchParams();

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8 pt-12">
            <Text
                variant="h1"
                className="text-center"
            >
                Nenhum registro feito ainda
            </Text>

            <div className="flex justify-center py-8">
                <Link
                    className={twMerge(
                        "bg-blue-500 text-white py-4 px-8",
                        "rounded-sm text-lg"
                    )}
                    scroll={false}
                    href={{
                        query: { c: "" }
                    }}
                >
                    Crie um registro agora
                </Link>
            </div>

            <PostCreation
                isOpen={searchParams.has("c")}
            />
        </main>
    );
}