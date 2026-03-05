import { createClient } from "~/utils/supabase/server";
import { HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import { ResumeSection } from "./_components/ResumeSection";
import { MenuSection } from "./_components/MenuSection";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";


export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if(!user) {
        redirect("/")
    }

  if (user) {
    await db.insert(users).values({
      id: user.id,
      name: user.user_metadata.full_name ?? "Guest",
      email: user.email ?? " ",
      image: user.user_metadata.avatar_url,
    }).onConflictDoNothing();
  }

    return(
        <HydrateClient>
        <main className="bg-gray-900 h-[100vh] w-[100vw] flex flex-col">
            <MenuSection user={user}></MenuSection>
            <ResumeSection></ResumeSection>
        </main>
        </HydrateClient>
    )
}