import { twMerge } from "tailwind-merge";

type SpinnerProps = {
    className?: HTMLDivElement["className"];
}

export default function Spinner ({ className: overriddenStyle }: SpinnerProps) {
    // SVG taken from tailwind example
    // https://tailwindcss.com/docs/animation#spin
    return (
        <svg
            className={twMerge(
                "animate-spin size-5",
                overriddenStyle
            )}
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-15"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                // eslint-disable-next-line max-len
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}