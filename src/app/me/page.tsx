import { redirect } from "next/navigation";

import Text from "@/components/atoms/Text";
import UserInfo from "@/components/organisms/UserInfo";
import MonthInfo from "@/components/molecules/MonthInfo";
import { getInsights, getUser } from "@/services/handlers";

export default async function Me () {
    const { username, createdAt, expiresAt } = await getUser();
    const { insights, total } = await getInsights();

    const hasValidUser = !!username && !!createdAt && !!expiresAt;
    if (!hasValidUser || !insights) {
        redirect("/");
    }

    const currentYear = new Date().getFullYear();

    return (
        <main className="font-[family-name:var(--font-geist-sans)] p-8 pt-12">
            <div className="w-full flex gap-4">
                <aside className="flex-1 flex gap-1 flex-col">
                    <Text className="font-medium">
                        Atividades desse ano ({currentYear})
                    </Text>
                    <div className="flex flex-wrap gap-1">
                        {insights.map(MonthInfo)}
                    </div>
                </aside>
                <UserInfo
                    username={username}
                    createdAt={createdAt}
                    expiresAt={expiresAt}
                    totalNumberOfPostsMade={total.numberOfPostsMade}
                />
            </div>
        </main>
    );
}