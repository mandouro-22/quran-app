"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, typeLoginSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { translateSupabaseError } from "@/lib/format/supabase-errors";
import { supabase } from "@/lib/supabase/client";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<typeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (value: typeLoginSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword(value);
      const translateErr = translateSupabaseError(error);
      if (translateErr) {
        setError(translateErr);
        return;
      }

      // clear Error
      setError(null);

      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الكترونى</FormLabel>
                      <FormControl>
                        <Input placeholder="m@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمه السر</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جارى تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
                {/* <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                هل نسيت كلمه السر؟
              </Link> */}
              </div>
              <div className="mt-4 text-center text-sm">
                ليس لديك حساب؟{" "}
                <Link
                  href="/auth/sign-up"
                  className="underline underline-offset-4"
                >
                  انشاء حساب
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
