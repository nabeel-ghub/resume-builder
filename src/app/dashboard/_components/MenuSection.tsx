"use client";
import type { User } from "@supabase/supabase-js";
import { Button } from "~/components/ui/button";
import { createClient } from "~/utils/supabase/client";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function MenuSection({ user }: { user: User }) {
  const supabase = createClient();
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/")
  };

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "User";

  return (
    <div className="flex min-h-[20vh] w-[100%] items-center justify-between pr-[20px] pl-[20px]">
      <h2 className="pt-1 text-[25px] font-[500] text-white font-[700]">
        {firstName}&apos;s <span className="text-blue-500">Dashboard</span>
      </h2>
      <Button variant={"default"} onClick={() => signOut()} className="hover:border-dotted h-10 w-30 uppercase text-sm tracking-[1.3px] font-semibold bg-transparent hover:text-red-600 cursor-pointer transition-colors duration-[0.3s] ease" title="Sign out of your dashboard">Sign out<FaSignOutAlt></FaSignOutAlt></Button>
    </div>
  );
}
