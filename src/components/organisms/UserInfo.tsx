"use client";
import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

import Text from "@/components/atoms/Text";
import DeletionPopup from "@/components/molecules/DeletionPopup";
import { useAccountDelete } from "@/services/hooks";

type UserInfoProps = {
    username: string;
    createdAt: Date;
    expiresAt: Date;
    totalNumberOfPostsMade: number;
};

export default function UserInfo ({
    username, createdAt, expiresAt, totalNumberOfPostsMade
}: UserInfoProps) {
    const initials = username.slice(0, 2);
    const customFormatString = "dd/MM/yyyy";
    const [isOpen, setIsOpen] = useState(false);

    const {
        isProcessing: isDeletingAccount,
        delete: deleteAccount
    } = useAccountDelete({
        onRejected: console.error
    });

    return (
        <>
            <aside className="w-80 h-fit max-h-[27rem]">
                <article className={twMerge(
                    "bg-white rounded-sm p-4 w-80 flex flex-col gap-4 h-fit",
                    "max-h-[27rem] shadow-md"
                )}
                >
                    <div className="flex items-center gap-2">
                        <section className={twMerge(
                            "w-12 h-12 rounded-full bg-dofu-secondary",
                            "flex items-center justify-center text-white"
                        )}>
                            {initials}
                        </section>
                        <section>
                            <Text className="font-bold">
                                {username}
                            </Text>
                            <Text>minha conta</Text>
                        </section>
                    </div>

                    <div>
                        <section className={twMerge(
                            "flex flex-col gap-4 text-white py-2 px-4",
                            "bg-gradient-to-br from-dofu-primary to-[#0A59DA]",
                            "from-40% via-[#2372F5] rounded-xl"
                        )}>
                            <div className="flex items-center justify-between">
                                <Text className="text-sm">Dofu Compras</Text>
                                ⚑
                            </div>

                            <div>
                                <Text className="text-sm">
                                    Postagens criadas (todos os anos)
                                </Text>
                                <Text className="text-2xl">
                                    {totalNumberOfPostsMade} 📄
                                </Text>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <Text className="text-sm">
                                        Conta criada em
                                    </Text>
                                    <Text>
                                        {format(createdAt, customFormatString)}
                                    </Text>
                                </div>

                                <div>
                                    <Text className="text-sm">
                                        Conta expira em
                                    </Text>
                                    <Text>
                                        {format(expiresAt, customFormatString)}
                                    </Text>
                                </div>
                            </div>
                        </section>
                    </div>

                    <Text>
                        Expiração da conta é prorrogada
                        em 1 ano após cada registro de compra
                    </Text>

                    <Link
                        className={twMerge(
                            "bg-dofu-primary text-white p-2",
                            "rounded-sm text-base text-center shadow-md"
                        )}
                        scroll={false}
                        href={{
                            pathname: "/",
                            query: { c: "" }
                        }}
                    >
                        Crie um registro agora
                    </Link>
                </article>
                <button
                    className="w-full text-right underline text-sm"
                    onClick={() => setIsOpen(true)}
                >
                    Deletar conta
                </button>
            </aside>
            <DeletionPopup
                isOpen={isOpen}
                isDeleting={isDeletingAccount}
                onPopupClose={() => setIsOpen(false)}
                onDelete={deleteAccount}
                title="Dejesa deletar essa conta e postagens feitas?"
            />
        </>
    );
}