import { createElement, HTMLAttributes } from "react";
import { twMerge } from 'tailwind-merge';

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
    variant?: "h1" | "h2" | "p";
}

const VARIANT = {
    h1: "font-bold text-center text-2xl",
    h2: "font-bold text-xl",
    p: "text-lg",
};

export default function Text ({
    variant = 'p',
    children,
    className: overriddenStyle,
    ...rest
}: TextProps) {
    const className = twMerge(
        VARIANT[variant],
        overriddenStyle
    );
    
    return createElement(
        variant,
        { ...rest, className },
        children
    );
}