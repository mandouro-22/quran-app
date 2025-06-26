import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ThemeSwitcher } from "./theme-switcher";

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center justify-end w-full">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="max-sm:hidden">
            <ThemeSwitcher />
          </div>
          <div className="flex items-center w-[90px] sm:w-[140px] gap-1">
            <span className="max-sm:hidden">مرحبا,</span>{" "}
            <h1 className="font-semibold">{user?.user_metadata?.full_name}</h1>{" "}
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">تسجيل دخول</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">اِنشاء حساب</Link>
      </Button>
    </div>
  );
}
