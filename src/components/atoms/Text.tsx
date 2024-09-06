import { createElement, HTMLAttributes } from "react";
import { twMerge } from 'tailwind-merge';

type TextProps = HTMLAttributes<HTMLParagraphElement> & {
    variant?: "h1" | "h2" | "h3" | "p";
}

const VARIANT = {
    h1: "font-bold text-2xl",
    h2: "font-bold text-xl",
    h3: "font-medium text-lg",
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