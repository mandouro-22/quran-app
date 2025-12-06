"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button onClick={logout} className="font-medium">
      <span className="max-sm:hidden">تسجيل الخروج</span>
      <span className="sm:hidden">
        <LogOut />
      </span>
    </Button>
  );
}
