"use client";
import { createClient } from "~/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { IoArrowRedoSharp } from "react-icons/io5";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface SignInWithGoogleProps {
  initialUser: User | null;
  firstName: string;
}

export function SignInWithGoogle({initialUser, firstName}: SignInWithGoogleProps) {
  const supabase = createClient();
  const router = useRouter();

  //Signing with google and always prompting account selection
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
        prompt: 'select_account',
        access_type: 'offline', 
      },
      },
    });
  };

  function redirectDashboard() {
    router.push("/dashboard");
  }

  return (
    <>
      {initialUser ? (
        <Button variant={"secondary"} onClick={() => redirectDashboard()} className="pt-6 pb-6 cursor-pointer">Redirect to dashboard <span className="text-blue-500 mb-[1.5px]"><IoArrowRedoSharp></IoArrowRedoSharp></span></Button>
      ) : (
        <Button variant={"secondary"} onClick={() => signIn()} className="pt-6 pb-6 cursor-pointer font-[500]">Sign in with <FcGoogle></FcGoogle></Button>
      )}
    </>
  );
}
