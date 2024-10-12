import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";

export type PostPreviewProps = {
    title: string;
    preview: string;
    createdAt: Date;
    side?: "right" | "left";
    className?: HTMLDivElement["className"];
    id: number;
}

export default function PostPreview ({
    title,
    preview,
    createdAt,
    className: overriddenStyle
}: PostPreviewProps) {
    const formattedMonth = format(createdAt, "MMM", { locale: ptBR });
    const formattedDay = format(createdAt, "dd");
    const formattedYear = format(createdAt, "yyyy");

    return (
        <article
            className={twMerge(
                "bg-white rounded-sm flex items-center w-96",
                overriddenStyle
            )}>
            <section
                className="p-4 border-gray-200 border-solid border-r w-full"
            >
                <Text variant="h2">{title}</Text>
                <Text className="text-gray-500">{preview}</Text>
            </section>

            <section
                className="p-4 capitalize text-center"
            >
                <Text
                    className="text-sm"
                >
                    {formattedMonth}
                </Text>
                <Text
                    className='text-2xl font-bold'
                >
                    {formattedDay}
                </Text>
                <Text   
                    className="text-sm"
                >
                    {formattedYear}
                </Text>
            </section>
        </article>
    );
}