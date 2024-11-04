"use client";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Text from "@/components/atoms/Text";
import PostCreation from "@/components/organisms/PostCreation";

export default function Empty () {
    const searchParams = useSearchParams();

    return (
        <main className={twMerge(
            "font-[family-name:var(--font-geist-sans)] p-8",
            "h-[calc(100%-2rem)] flex items-center justify-center"
        )}>
            <section>
                <Text
                    variant="h1"
                    className="text-center"
                >
                    Nenhum registro feito ainda
                </Text>

                <div className="flex justify-center py-8">
                    <Link
                        className={twMerge(
                            "bg-dofu-primary text-white py-4 px-8",
                            "rounded-sm text-lg shadow-md"
                        )}
                        scroll={false}
                        href={{
                            query: { c: "" }
                        }}
                    >
                        Crie um registro agora
                    </Link>
                </div>
            </section>

            <PostCreation
                isOpen={searchParams.has("c")}
            />
        </main>
    );
}