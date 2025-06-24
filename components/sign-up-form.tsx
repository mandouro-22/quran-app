"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setIsLoading(false);
      return;
    }
    if (!fullName) {
      setError("الرجاء إدخال الاسم الكامل");
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (!user?.id) {
        setError("تم إرسال رابط التفعيل، من فضلك فعّل بريدك الإلكتروني أولاً.");
        setIsLoading(false);
        return;
      }

      const sendProfileData = {
        id: user.id,
        full_name: fullName,
      };

      const { error: errProfile } = await supabase
        .from("profiles")
        .update(sendProfileData)
        .eq("id", user.id)
        .select("id");

      if (errProfile) throw errProfile;

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
          <CardDescription>إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="full-name">الاسم الكامل</Label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">تأكيد كلمة المرور</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
