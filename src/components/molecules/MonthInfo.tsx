import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";

type MonthInfoProps = {
    position: number;
    numberOfPostsMade: number;
    numberOfImagesUploaded: number;
    fullName: string;
}

export default function MonthInfo ({
    position, fullName, numberOfImagesUploaded, numberOfPostsMade
}: MonthInfoProps) {
    const hasDataToShow = numberOfPostsMade > 0;
    const currentMonthPosition = new Date().getMonth() + 1;
    const inFutureMonthRendering = position > currentMonthPosition;

    return (
        <article
            key={fullName}
            className={twMerge(
                "border-gray-300 border-solid border shadow-md rounded-sm",
                "p-4 w-52 min-w-48 flex flex-col gap-4 bg-gray-100",
            )}
        >
            <section className="flex items-center gap-2">
                <div className={twMerge(
                    "w-10 h-10 flex items-center font-semibold",
                    "justify-center rounded-full text-lg",
                    currentMonthPosition === position
                        && "bg-dofu-secondary text-white",
                )}>
                    {String(position).padStart(2, "0")}
                </div>
                <Text className="font-semibold text-base capitalize">
                    {fullName} 🗓️
                </Text>
            </section>

            {hasDataToShow && (
                <section>
                    <div className="flex items-center gap-4">
                        <Text className="text-xs">
                    Postagens criadas
                        </Text>
                        <Text>{numberOfPostsMade}</Text>
                    </div>

                    <div className="flex items-center gap-4">
                        <Text className="text-xs">
                    Imagens anexadas
                        </Text>
                        <Text>{numberOfImagesUploaded}</Text>
                    </div>
                </section>
            )}

            {!hasDataToShow && (
                <section>
                    <Text className="text-center">
                        {inFutureMonthRendering
                            ? "-"
                            : "x"
                        }
                    </Text>
                </section>
            )}
        </article>
    );
}