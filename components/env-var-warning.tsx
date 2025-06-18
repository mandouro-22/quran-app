import Link from "next/link";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-2">
        <Link href={"/auth/login"}>تسجيل دخول</Link>
        <Link href={"/auth/sgin-up"}>اٍنشاء حساب</Link>
      </div>
    </div>
  );
}
