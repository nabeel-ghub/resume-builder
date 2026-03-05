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

  return (
    <div className="flex min-h-[20vh] w-[100%] items-center justify-between pr-[20px] pl-[20px]">
      <h2 className="pt-1 text-[25px] font-[500] text-white font-[700]">
        {user?.user_metadata.full_name.split(" ")[0]}'s <span className="text-blue-500">Dashboard</span>
      </h2>
      <Button variant={"destructive"} onClick={() => signOut()} className="hover:border-dotted hover:border-[1.5px] hover:border-red-700 cursor-pointer transition-colors duration-[0.4s] ease">Sign out<FaSignOutAlt></FaSignOutAlt></Button>
    </div>
  );
}
