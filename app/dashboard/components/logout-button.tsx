"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface LogoutButtonProps {
  /** Display name or email shown next to the button */
  displayName: string;
}

/** Client component: signs out the user and redirects to login */
export function LogoutButton({ displayName }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70 hidden sm:block">{displayName}</span>
      <button
        onClick={handleLogout}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
