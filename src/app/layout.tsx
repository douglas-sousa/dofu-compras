import type { Metadata } from "next";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900"
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900"
});

export const metadata: Metadata = {
    title: "Dofu Purchases",
    description: "Algumas compras que eu decidi registrar"
};

export default function RootLayout ({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={
                    `${geistSans.variable} ${geistMono.variable} antialiased`
                }
            >
                <header
                    className={twMerge(
                        "bg-blue-500 p-2 text-white text-right text-sm",
                        "fixed w-full z-40"
                    )}
                >
                    <a
                        href="https://github.com/douglas-sousa"
                        target="_blank"
                    >
                            Criação do Douglas
                    </a>
                </header>
                {children}
            </body>
        </html>
    );
}