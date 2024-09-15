import {
    type InputHTMLAttributes, type FormEvent,
    useState, createElement
} from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    isMultiline?: boolean;
};

export default function Input ({
    className,
    maxLength = 255,
    placeholder,
    onInput: callback,
    isMultiline = false,
    ...rest
}: InputProps) {
    const [numOfAvailableChars, setNumOfAvailableChars] =
        useState<number | null>(null);

    function onInput (event: FormEvent<HTMLInputElement>) {
        const input = event.target as HTMLInputElement;

        if (isMultiline) {
            input.style.height = "auto";
            input.style.height = `${input.scrollHeight}px`;
        }

        const currentNumOfAvailableChars = maxLength - input.value.length;

        if (maxLength - input.value.length < 21) {
            setNumOfAvailableChars(currentNumOfAvailableChars);
        } else {
            setNumOfAvailableChars(null);
        }

        callback?.(event);
    }

    return (
        <div className="relative">
            {createElement(
                isMultiline ? "textarea" : "input",
                {
                    ...rest,
                    placeholder,
                    maxLength,
                    onInput,
                    className: twMerge(
                        "placeholder-gray-600 py-2 px-4 w-full",
                        isMultiline && "overflow-y-hidden",
                        className
                    ),
                    rows: 1
                }
            )}
            {numOfAvailableChars !== null && (
                <Text
                    className={twMerge(
                        "text-xs absolute -bottom-4 right-4",
                    )}
                >
                    {numOfAvailableChars} de {maxLength}
                </Text>
            )}
        </div>
    );
}