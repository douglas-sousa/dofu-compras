import { twMerge } from "tailwind-merge";

import Text from "@/components/atoms/Text";
import Popup from "@/components/atoms/Popup";
import Spinner from "@/components/atoms/Spinner";

type DeletionPopupProps = {
    isOpen: boolean;
    isDeleting: boolean;
    onPopupClose: () => void;
    onDelete: () => void;
    title: string;
}

export default function DeletionPopup ({
    isOpen,
    isDeleting,
    onPopupClose,
    onDelete,
    title
}: DeletionPopupProps) {
    return (
        <Popup
            isOpen={isOpen}
            onClose={onPopupClose}
        >
            <div className="py-8 px-6 flex flex-col gap-8 items-center">
                <Text className="text-5xl text-red-500">
                    ⚠
                </Text>

                <Text className="text-center">
                    {title}
                </Text>

                <section className="w-full flex justify-between gap-8">
                    <button
                        className={twMerge(
                            "bg-red-500 text-white flex-1 rounded-sm",
                            "shadow-md py-2",
                            "flex justify-center items-center gap-4"
                        )}
                        onClick={onDelete}
                    >
                        {isDeleting && (
                            <Spinner
                                className="-ml-8"
                            />
                        )}
                        Deletar
                    </button>

                    <button
                        className={twMerge(
                            "border-gray-300 border-solid border",
                            "shadow-md flex-1 py-2 rounded-sm"
                        )}
                        onClick={onPopupClose}
                    >
                        Manter
                    </button>
                </section>
            </div>
        </Popup>
    );
}