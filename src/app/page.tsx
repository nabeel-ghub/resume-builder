import { createClient } from "~/utils/supabase/server";
import { HydrateClient } from "~/trpc/server";
import { SignInWithGoogle } from "./_components/SignInWithGoogle";

export default async function Home() {
  // 1. Initialize Supabase Server Client
  const supabase = await createClient();

  // 2. Fetch the user once on the server
  const {data: { user }} = await supabase.auth.getUser();

  // 3. Extract metadata safely
  const firstName = user?.user_metadata?.given_name ?? user?.user_metadata?.full_name?.split(" ")[0];

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white px-4">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-[70px] font-[900] tracking-tight leading-tight text-center">
              Build your <span className="text-blue-500">Resume.</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-zinc-400 font-medium text-center">
              {user ? (
                <>Welcome back, <span className="text-white">{firstName}</span>. Ready to polish your resume?</>
              ) : (
                <>A Simple resume builder for simple developers.</>
              )}
            </h2>
          </div>
          <div className="flex flex-col items-center mt-10 w-full">
            <SignInWithGoogle initialUser={user} firstName={firstName}/>
        </div>
      </main>
    </HydrateClient>
  );
}