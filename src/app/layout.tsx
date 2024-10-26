import type { Metadata } from "next";
import Image from "next/image";
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
    title: "Dofu Compras",
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
                        "bg-blue-500 p-2 text-white text-sm",
                        "fixed w-full z-40 flex items-center justify-between"
                    )}
                >
                    <section
                        className="inline-flex gap-1 items-center"
                    >
                        <Image
                            src="/icon-secondary.png"
                            alt="logo do dofu compras"
                            width={18}
                            height={18}
                        />
                        Dofu Compras
                    </section>
                    <section>
                        <a
                            href="https://github.com/douglas-sousa"
                            target="_blank"
                            className="inline-flex gap-1 items-center"
                        >
                            Criação do Douglas
                            <Image
                                src="/github-mark-white.png"
                                alt="logo do github"
                                width={18}
                                height={18}
                            />
                        </a>
                    </section>
                </header>
                {children}
            </body>
        </html>
    );
}