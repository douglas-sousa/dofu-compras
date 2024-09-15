"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import PostCreation from "@/components/organisms/PostCreation";

export default function Empty () {
    const [inCreation, setInCreation] = useState(false);

    function onPostCreationClick () {
        setInCreation(true);
    }

    function onDrawerClose () {
        setInCreation(false);
    }

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8">
            <Text
                variant="h1"
                className="text-center"
            >
                Nenhum registro feito ainda
            </Text>

            <div className="flex justify-center py-8">
                <button
                    className={twMerge(
                        "bg-blue-500 text-white py-4 px-8",
                        "rounded-sm text-lg"
                    )}
                    onClick={onPostCreationClick}
                >
                    Crie um registro agora
                </button>
            </div>

            <PostCreation
                isOpen={inCreation}
                onClose={onDrawerClose}
            />
        </main>
    );
}